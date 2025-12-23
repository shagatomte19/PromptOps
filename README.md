# PromptOps Cloud 🚀

> **DevOps for AI Prompts & Agents**

PromptOps Cloud is a production-grade SaaS platform designed to bring engineering rigor to the development of Large Language Model (LLM) applications. It treats prompts as first-class software artifacts, providing version control, testing, monitoring, and CI/CD workflows for AI agents.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2.svg)

## ✨ Features

- **3D Interactive Landing Page**: Immersive experience using Three.js and React Three Fiber.
- **Visual Prompt IDE**: Advanced editor with variable interpolation (`{{variable}}`) and real-time streaming inference using Google Gemini models.
- **Environment Management**: Isolate prompts across **Development**, **Staging**, and **Production** environments.
- **Performance Monitoring**: Real-time dashboards for tracking latency (P95), token usage, and estimated costs.
- **Deployment History**: Track changes, rollbacks, and audit logs for every prompt version.
- **Dark Mode UI**: Enterprise-grade, glassmorphic design system built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 (Hooks, Context API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + `clsx` + `tailwind-merge`
- **Animation**: Framer Motion
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite (implied structure)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the Gemini API enabled
- An API Key for Google Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/promptops-cloud.git
   cd promptops-cloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   The application requires a Google Gemini API Key.
   
   *Note: In this specific web-container environment, the key is expected to be available via `process.env.API_KEY`.*

   If running locally, create a `.env` file:
   ```env
   VITE_API_KEY=your_google_gemini_api_key
   ```
   *(You may need to adjust the code in `PromptEditor.tsx` to read from `import.meta.env.VITE_API_KEY` if using Vite locally).*

4. **Run the application**
   ```bash
   npm start
   # or
   npm run dev
   ```

## 📂 Project Structure

```
├── components/
│   ├── dashboard/       # Dashboard specific views (Editor, Monitor, etc.)
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Landing page sections (Hero, Features, Pricing)
│   ├── three/           # Three.js 3D scenes and components
│   └── ui/              # Reusable UI atoms (Buttons, Cards)
├── contexts/            # React Context (Workspace, Auth)
├── pages/               # Route pages (Landing, Dashboard, Docs)
├── utils/               # Helpers (cn, formatting)
├── App.tsx              # Main Router setup
├── index.tsx            # Entry point with ErrorBoundary
└── index.html           # HTML template
```

## 🤖 AI Usage Guidelines

This project uses the **Google GenAI SDK**.
- **Model Selection**: Defaults to `gemini-3-flash-preview` for speed and `gemini-3-pro-preview` for complex reasoning.
- **Streaming**: Implements `generateContentStream` for real-time text generation feedback.
- **Safety**: API Keys are handled securely (ensure backend proxying in real production environments).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ for AI Engineers.*
