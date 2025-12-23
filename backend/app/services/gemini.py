"""
Gemini AI service for prompt inference with streaming support.
"""

import time
import asyncio
from functools import lru_cache
from typing import Optional, AsyncGenerator
import google.generativeai as genai

from app.config import get_settings


# Pricing per million tokens (approximate, update as needed)
GEMINI_PRICING = {
    "gemini-2.0-flash": {"input": 0.075, "output": 0.30},
    "gemini-2.0-flash-lite": {"input": 0.075, "output": 0.30},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    "gemini-pro": {"input": 0.50, "output": 1.50},
}


class InferenceResult:
    """Result of an inference request."""
    def __init__(
        self,
        text: str,
        model: str,
        latency_ms: int,
        input_tokens: int = 0,
        output_tokens: int = 0,
        success: bool = True,
        error: Optional[str] = None
    ):
        self.text = text
        self.model = model
        self.latency_ms = latency_ms
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.total_tokens = input_tokens + output_tokens
        self.success = success
        self.error = error
        
        # Calculate cost
        pricing = GEMINI_PRICING.get(model, {"input": 0.10, "output": 0.30})
        input_cost = (input_tokens / 1_000_000) * pricing["input"]
        output_cost = (output_tokens / 1_000_000) * pricing["output"]
        self.estimated_cost_cents = (input_cost + output_cost) * 100


class GeminiService:
    """
    Service for interacting with Google Gemini API.
    Supports both streaming and non-streaming inference.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
    
    def _interpolate_variables(self, prompt: str, variables: dict) -> str:
        """Replace {{variable}} placeholders with values."""
        result = prompt
        for key, value in variables.items():
            result = result.replace(f"{{{{{key}}}}}", str(value))
        return result
    
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        variables: Optional[dict] = None,
        model: str = "gemini-2.0-flash",
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> InferenceResult:
        """
        Generate a response from Gemini (non-streaming).
        """
        start_time = time.time()
        
        try:
            # Interpolate variables
            if variables:
                user_prompt = self._interpolate_variables(user_prompt, variables)
            
            # Create model
            gen_model = genai.GenerativeModel(
                model_name=model,
                system_instruction=system_prompt if system_prompt else None,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
            )
            
            # Generate response
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: gen_model.generate_content(user_prompt)
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            
            # Extract text
            text = response.text if response.text else ""
            
            # Get token counts (estimate if not available)
            input_tokens = len(user_prompt) // 4  # Rough estimate
            output_tokens = len(text) // 4
            
            if hasattr(response, 'usage_metadata'):
                input_tokens = response.usage_metadata.prompt_token_count or input_tokens
                output_tokens = response.usage_metadata.candidates_token_count or output_tokens
            
            return InferenceResult(
                text=text,
                model=model,
                latency_ms=latency_ms,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                success=True
            )
            
        except Exception as e:
            latency_ms = int((time.time() - start_time) * 1000)
            return InferenceResult(
                text="",
                model=model,
                latency_ms=latency_ms,
                success=False,
                error=str(e)
            )
    
    async def generate_stream(
        self,
        system_prompt: str,
        user_prompt: str,
        variables: Optional[dict] = None,
        model: str = "gemini-2.0-flash",
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> AsyncGenerator[str, None]:
        """
        Generate a streaming response from Gemini.
        Yields text chunks as they arrive.
        """
        try:
            # Interpolate variables
            if variables:
                user_prompt = self._interpolate_variables(user_prompt, variables)
            
            # Create model
            gen_model = genai.GenerativeModel(
                model_name=model,
                system_instruction=system_prompt if system_prompt else None,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
            )
            
            # Generate streaming response
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: gen_model.generate_content(user_prompt, stream=True)
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            yield f"[ERROR] {str(e)}"


@lru_cache()
def get_gemini_service() -> GeminiService:
    """Get cached Gemini service instance."""
    settings = get_settings()
    return GeminiService(api_key=settings.gemini_api_key)
