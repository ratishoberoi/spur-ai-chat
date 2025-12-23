# Spur AI Support Chat

A production-minded AI-powered customer support chat application built as part of the **Spur Software Engineer assignment**.

This project simulates a realistic AI support agent for a small e-commerce store, with a strong focus on **clean architecture, robustness, correctness, and UX polish**.

---

## ✨ Features

- End-to-end chat experience (Frontend + Backend)
- Session-based conversations
- Persistent message storage
- Real LLM integration (Groq – LLaMA 3.1)
- Graceful error handling
- Typing indicator with realistic typing effect
- Clean, readable, idiomatic TypeScript codebase

---

## 🧱 Architecture Overview

### High-Level Flow

React Frontend (Vite)
↓
POST /chat/message
↓
Chat Route (validation + orchestration)
↓
Chat Service (DB persistence + history)
↓
LLM Service (Groq LLaMA 3.1)
↓
Persist AI reply → return response

yaml
Copy code

The backend is intentionally **stateless** — conversation context is reconstructed from the database on every request.  
This makes the system predictable, easy to reason about, and easy to extend to additional channels (WhatsApp, Instagram, etc.).

---

## 📁 Backend Structure (TypeScript + Node.js)

backend/
├─ src/
│ ├─ routes/
│ │ └─ chat.route.ts # HTTP layer, validation, error handling
│ ├─ services/
│ │ ├─ chat.service.ts # Conversation & message persistence
│ │ └─ llm.service.ts # LLM integration (encapsulated)
│ ├─ db/
│ │ └─ prisma.ts # Prisma client
│ └─ server.ts # App bootstrap
├─ prisma/
│ └─ schema.prisma # Data model & migrations
└─ package.json

markdown
Copy code

### Key Design Decisions

- Routes handle **only HTTP concerns**
- Services contain **business logic**
- LLM integration is **isolated behind a single service**
- Prisma ORM ensures **clean, type-safe database access**

---

## 🖥 Frontend Structure (React + TypeScript + Vite)

- Single chat window UI
- Clear distinction between user and AI messages
- Auto-scroll to latest message
- Enter-to-send support
- Disabled input while request is in flight
- Typing indicator with character-by-character AI response simulation

The typing effect avoids the “instant AI response” feel and makes the interaction closer to a real support agent.

---

## 🗄 Data Model & Persistence

### Conversations
- `id`
- `createdAt`

### Messages
- `id`
- `conversationId`
- `sender` (`user` | `ai`)
- `text`
- `createdAt`

Every user and AI message is persisted.  
Conversation context is reconstructed from the database on each request.

---

## 🚀 Running Locally (Step-by-Step)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ratishoberoi/spur-ai-chat.git
cd spur-ai-chat
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Configure Environment Variables
Create a .env file:

bash
Copy code
type nul > .env
Add the following:

env
Copy code
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=file:./dev.db
3️⃣ Database Setup (Prisma)
bash
Copy code
npx prisma migrate dev
This will:

Apply schema migrations

Create the SQLite database

Generate the Prisma client

4️⃣ Start the Backend
bash
Copy code
npm run dev
Backend will run at:

arduino
Copy code
http://localhost:4000
5️⃣ Frontend Setup
Open a new terminal window:

bash
Copy code
cd frontend
npm install
npm run dev
Frontend will run at:

arduino
Copy code
http://localhost:5173
You can now chat end-to-end locally.

🔌 Backend API Endpoints (Verification & Testing)
The backend is an API-only service and does not expose a root (/) page.

If you open:

arduino
Copy code
https://spur-ai-chat-backend-r7hv.onrender.com/
You will see:

sql
Copy code
Cannot GET /
This is expected behavior.

1️⃣ Health Check Endpoint
URL

bash
Copy code
GET /health
Example

bash
Copy code
https://spur-ai-chat-backend-r7hv.onrender.com/health
Response

json
Copy code
{
  "status": "ok",
  "service": "spur-ai-chat-backend"
}
Purpose:

Confirms backend is running

Useful for deployment verification

2️⃣ Chat Message Endpoint (Core API)
URL

bash
Copy code
POST /chat/message
Example

bash
Copy code
https://spur-ai-chat-backend-r7hv.onrender.com/chat/message
Request Body

json
Copy code
{
  "message": "What is your return policy?"
}
Response

json
Copy code
{
  "reply": "We offer a 7-day no-questions-asked return policy...",
  "conversationId": "generated-conversation-id"
}
Notes:

conversationId can be reused to continue the same conversation

All messages are persisted

This endpoint is consumed by the deployed frontend

3️⃣ Manual API Testing (Optional)
bash
Copy code
curl -X POST https://spur-ai-chat-backend-r7hv.onrender.com/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Do you ship to USA?"}'
🤖 LLM Integration Notes
Provider: Groq

Model: LLaMA 3.1 (8B)

Why Groq?

Free tier available

Very low latency

OpenAI-compatible API

Prompting Strategy
System prompt defines the agent as a helpful e-commerce support agent

Store policies (shipping, returns, support hours) are embedded directly

Recent conversation history is included for contextual replies

History length is capped to control cost and latency

🛡 Robustness & Error Handling
Empty messages are rejected

Backend never crashes on invalid input

LLM/API failures are caught and surfaced as friendly user-facing errors

Frontend disables input during in-flight requests

No secrets are committed to the repository

Graceful failure is always preferred over silent failure.

⚖ Trade-offs & Future Improvements
Trade-offs
SQLite chosen for simplicity and portability

Prompt-based FAQ knowledge instead of a vector database

If I Had More Time…
Add vector search for dynamic FAQs

Reload conversation history on page refresh

Stream LLM responses instead of simulated typing

Add basic analytics (latency, error rates)

Improve accessibility and theming

🌍 Deployment
Frontend (Vercel):
https://spur-ai-chat.vercel.app

Backend (Render):
https://spur-ai-chat-backend-r7hv.onrender.com

yaml
Copy code
