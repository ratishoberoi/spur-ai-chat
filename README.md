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
```
backend
├── prisma
│   └── schema.prisma
├── src
│   ├── db
│   │   └── prisma.ts
│   ├── routes
│   │   └── chat.route.ts
│   ├── services
│   │   ├── chat.service.ts
│   │   └── llm.service.ts
│   └── server.ts
└── package.json
```

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

git clone https://github.com/ratishoberoi/spur-ai-chat.git
cd spur-ai-chat

yaml
Copy code

---

### 2️⃣ Backend Setup

cd backend
npm install

markdown
Copy code

#### Configure Environment Variables

Create a `.env` file inside the `backend` directory:

type nul > .env

pgsql
Copy code

Add the following to `.env`:

GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=file:./dev.db

yaml
Copy code

---

### 3️⃣ Database Setup (Prisma)

Run migrations:

npx prisma migrate dev

yaml
Copy code

This will:
- Apply schema migrations
- Create the SQLite database (`dev.db`)
- Generate the Prisma client

---

### 4️⃣ Start the Backend

npm run dev

powershell
Copy code

Backend will start at:

http://localhost:4000

yaml
Copy code

---

### 5️⃣ Frontend Setup

Open a **new terminal window**, then run:

cd frontend
npm install
npm run dev

powershell
Copy code

Frontend will start at:

http://localhost:5173

yaml
Copy code

You can now chat end-to-end locally.

---

## 🔌 Backend API Endpoints (Verification & Testing)

The backend is an **API-only service** and does not expose a root (`/`) page.

If you open:

https://spur-ai-chat-backend-r7hv.onrender.com/

yaml
Copy code

You will see:

Cannot GET /

yaml
Copy code

This is expected behavior.

---

### 1️⃣ Health Check Endpoint

**URL**
GET /health

markdown
Copy code

**Example**
https://spur-ai-chat-backend-r7hv.onrender.com/health

markdown
Copy code

**Response**
{
"status": "ok",
"service": "spur-ai-chat-backend"
}

yaml
Copy code

---

### 2️⃣ Chat Message Endpoint (Core API)

**URL**
POST /chat/message

markdown
Copy code

**Example**
https://spur-ai-chat-backend-r7hv.onrender.com/chat/message

css
Copy code

**Request Body**
{
"message": "What is your return policy?"
}

markdown
Copy code

**Response**
{
"reply": "We offer a 7-day no-questions-asked return policy...",
"conversationId": "generated-conversation-id"
}

yaml
Copy code

- `conversationId` can be reused to continue the same conversation
- All user and AI messages are persisted

---

### 3️⃣ Manual API Testing (Optional)

curl -X POST https://spur-ai-chat-backend-r7hv.onrender.com/chat/message
-H "Content-Type: application/json"
-d '{"message":"Do you ship to USA?"}'

yaml
Copy code

---

## 🤖 LLM Integration Notes

- **Provider:** Groq
- **Model:** LLaMA 3.1 (8B)
- **Why Groq?**
  - Free tier available
  - Very low latency
  - OpenAI-compatible API

### Prompting Strategy

- System prompt defines the agent as a helpful e-commerce support agent
- Store policies (shipping, returns, support hours) are embedded directly
- Recent conversation history is included for contextual replies
- History length is capped to control cost and latency

---

## 🛡 Robustness & Error Handling

- Empty messages are rejected
- Backend never crashes on invalid input
- LLM/API failures are caught and surfaced as friendly user-facing errors
- Frontend disables input during in-flight requests
- No secrets are committed to the repository

Graceful failure is always preferred over silent failure.

---

## ⚖ Trade-offs & Future Improvements

### Trade-offs

- SQLite chosen for simplicity and portability
- Prompt-based FAQ knowledge instead of a vector database

### If I Had More Time…

- Add vector search for dynamic FAQs
- Reload conversation history on page refresh
- Stream LLM responses instead of simulated typing
- Add basic analytics (latency, error rates)
- Improve accessibility and theming

---

## 🌍 Deployment

- **Frontend (Vercel):**  
  https://spur-ai-chat.vercel.app

- **Backend (Render):**  
  https://spur-ai-chat-backend-r7hv.onrender.com
