# PromptOps Cloud

> **DevOps for AI Prompts & Agents** — Version, test, deploy, and monitor your LLM prompts like production code.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![React](https://img.shields.io/badge/React-18.2-cyan)

---

## 🏗️ Architecture

```
promptops/
├── backend/          # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # Business logic
│   │   └── main.py   # App entry point
│   └── requirements.txt
│
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── stores/
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

---

## ✨ Features

- **Prompt Versioning** — Git-like version control for prompts with diffs and history
- **Multi-Environment** — Deploy to dev, staging, and production independently
- **A/B Testing** — Run experiments with traffic splitting and statistical analysis
- **Real-time Monitoring** — Track latency, costs, tokens, and success rates
- **Streaming Inference** — Execute prompts with SSE streaming
- **Activity Logs** — Full audit trail of all operations
- **Supabase Auth** — Email + OAuth (Google, GitHub)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account (for auth & PostgreSQL)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/promptops.git
cd promptops
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run server
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run dev server
npm run dev
```

### 4. Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/api/docs

---

## 🔧 Configuration

### Backend `.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
GEMINI_API_KEY=your-gemini-key
```

### Frontend `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/prompts` | List all prompts |
| `POST /api/v1/prompts` | Create prompt with version |
| `POST /api/v1/inference/run` | Execute prompt |
| `POST /api/v1/inference/run/stream` | Stream prompt execution (SSE) |
| `GET /api/v1/metrics/overview` | Get metrics dashboard data |
| `POST /api/v1/deployments` | Deploy version to environment |

Full documentation at `/api/docs` when server is running.

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI + Uvicorn
- SQLAlchemy (async) + PostgreSQL
- Pydantic v2
- Google Generative AI (Gemini)
- Supabase Auth

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state)
- Framer Motion
- Lucide Icons

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
