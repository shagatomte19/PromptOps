"""
Inference API router - AI execution with streaming support.
"""

import time
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.services.gemini import GeminiService, get_gemini_service
from app.services.activity import ActivityService
from app.models.metric import Metric
from app.models.prompt import Prompt, PromptVersion
from app.schemas.inference import InferenceRequest, InferenceResponse, InferenceTestRequest


router = APIRouter(prefix="/inference", tags=["Inference"])


@router.post("/run", response_model=InferenceResponse)
async def run_inference(
    data: InferenceRequest,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user),
    gemini: GeminiService = Depends(get_gemini_service)
):
    """
    Execute a prompt and return the full response.
    Use /run/stream for streaming responses.
    """
    result = await gemini.generate(
        system_prompt=data.system_prompt,
        user_prompt=data.user_prompt,
        variables=data.variables,
        model=data.model,
        temperature=data.temperature,
        max_tokens=data.max_tokens
    )
    
    # Store metric
    metric = Metric(
        user_id=user.id,
        deployment_id=data.deployment_id,
        prompt_id=data.prompt_id,
        version_id=data.version_id,
        experiment_variant_id=data.experiment_variant_id,
        model=data.model,
        latency_ms=result.latency_ms,
        input_tokens=result.input_tokens,
        output_tokens=result.output_tokens,
        total_tokens=result.total_tokens,
        estimated_cost_cents=result.estimated_cost_cents,
        success=result.success,
        error_message=result.error
    )
    db.add(metric)
    await db.commit()
    
    # Log activity
    activity_service = ActivityService(db)
    await activity_service.log_inference(user.id, data.model, result.latency_ms, result.success)
    
    return InferenceResponse(
        text=result.text,
        model=result.model,
        latency_ms=result.latency_ms,
        input_tokens=result.input_tokens,
        output_tokens=result.output_tokens,
        total_tokens=result.total_tokens,
        estimated_cost_cents=result.estimated_cost_cents,
        success=result.success,
        error=result.error
    )


@router.post("/run/stream")
async def run_inference_stream(
    data: InferenceRequest,
    user: SupabaseUser = Depends(get_current_user),
    gemini: GeminiService = Depends(get_gemini_service)
):
    """
    Execute a prompt with streaming response (Server-Sent Events).
    """
    async def generate():
        start_time = time.time()
        full_text = ""
        
        try:
            async for chunk in gemini.generate_stream(
                system_prompt=data.system_prompt,
                user_prompt=data.user_prompt,
                variables=data.variables,
                model=data.model,
                temperature=data.temperature,
                max_tokens=data.max_tokens
            ):
                full_text += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
            
            # Send final stats
            latency_ms = int((time.time() - start_time) * 1000)
            yield f"data: {json.dumps({'type': 'done', 'latency_ms': latency_ms, 'total_chars': len(full_text)})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.post("/test", response_model=InferenceResponse)
async def test_prompt_version(
    data: InferenceTestRequest,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user),
    gemini: GeminiService = Depends(get_gemini_service)
):
    """
    Test a specific prompt version with provided variables.
    """
    # Get the version
    result = await db.execute(
        select(PromptVersion)
        .join(Prompt)
        .where(
            PromptVersion.id == data.version_id,
            PromptVersion.prompt_id == data.prompt_id,
            Prompt.user_id == user.id
        )
    )
    version = result.scalar_one_or_none()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    # Run inference
    inference_result = await gemini.generate(
        system_prompt=version.system_prompt,
        user_prompt=version.user_prompt,
        variables=data.variables,
        model=version.model,
        temperature=version.temperature,
        max_tokens=version.max_tokens
    )
    
    # Store metric
    metric = Metric(
        user_id=user.id,
        prompt_id=data.prompt_id,
        version_id=data.version_id,
        model=version.model,
        latency_ms=inference_result.latency_ms,
        input_tokens=inference_result.input_tokens,
        output_tokens=inference_result.output_tokens,
        total_tokens=inference_result.total_tokens,
        estimated_cost_cents=inference_result.estimated_cost_cents,
        success=inference_result.success,
        error_message=inference_result.error
    )
    db.add(metric)
    await db.commit()
    
    return InferenceResponse(
        text=inference_result.text,
        model=inference_result.model,
        latency_ms=inference_result.latency_ms,
        input_tokens=inference_result.input_tokens,
        output_tokens=inference_result.output_tokens,
        total_tokens=inference_result.total_tokens,
        estimated_cost_cents=inference_result.estimated_cost_cents,
        success=inference_result.success,
        error=inference_result.error
    )
