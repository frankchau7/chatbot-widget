# Chatbot Widget

An AI-powered chatbot widget built with **React**, **GraphQL**, and **Retrieval-Augmented Generation (RAG)**. The chatbot automatically crawls a target website, builds a knowledge base, and answers user questions using context-aware AI — all running locally via [Ollama](https://ollama.com/).

## Architecture

```
┌─────────────────────────────────────┐
│          Frontend (Vite + React)    │
│  React 19 · TailwindCSS · Apollo   │
│         localhost:5173              │
└──────────────┬──────────────────────┘
               │ GraphQL
               ▼
┌─────────────────────────────────────┐
│     Backend (Express + Apollo)      │
│   GraphQL API · RAG Pipeline        │
│         localhost:4000/graphql      │
└──────┬──────────────┬───────────────┘
       │              │
       ▼              ▼
┌────────────┐  ┌─────────────┐
│   Ollama   │  │  ChromaDB   │
│ LLM + Embed│  │ Vector Store│
│   :11434   │  │   :8000     │
└────────────┘  └─────────────┘
```

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, TailwindCSS 4, Apollo Client, React Router |
| Backend | Express 5, Apollo Server, GraphQL, LangChain |
| AI/LLM | Ollama (`qwen3:8b` for chat, `nomic-embed-text` for embeddings) |
| Vector DB | ChromaDB |
| Web Scraping | Playwright (headless Chromium) |

## Prerequisites

Make sure you have the following installed before getting started:

- **[Node.js](https://nodejs.org/)** (v18 or later)
- **[Ollama](https://ollama.com/)** — local LLM runtime
- **[ChromaDB](https://docs.trychroma.com/getting-started)** — vector database
- **[Playwright Browsers](https://playwright.dev/)** — for web crawling

### Install Ollama Models

After installing Ollama, pull the required models:

```bash
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

### Start ChromaDB

ChromaDB needs to be running on port `8000`. You can run it via Docker or pip:

**Docker (recommended):**
```bash
docker run -p 8000:8000 chromadb/chroma
```

**pip:**
```bash
pip install chromadb
chroma run --host 0.0.0.0 --port 8000
```

### Install Playwright Browsers

```bash
npx playwright install chromium
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/frankchau7/chatbot-widget.git
cd chatbot-widget
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Backend services
CHROMA_URL=http://localhost:8000
OLLAMA_BASE_URL=http://localhost:11434
CLINIC_URL=https://your-target-website.com/

# Server
SERVER_PORT=4000

# Frontend (VITE_ prefix required for client-side access)
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

| Variable | Description | Default |
|----------|-------------|---------|
| `CHROMA_URL` | URL of your ChromaDB instance | `http://localhost:8000` |
| `OLLAMA_BASE_URL` | URL of your Ollama instance | `http://localhost:11434` |
| `CLINIC_URL` | The website the chatbot will crawl and answer questions about | — |
| `SERVER_PORT` | Port the GraphQL backend runs on | `4000` |
| `VITE_GRAPHQL_URL` | GraphQL endpoint URL used by the frontend | `http://localhost:4000/graphql` |

### 4. Start the app

```bash
npm start
```

This runs both servers concurrently:
- **Frontend** → [http://localhost:5173](http://localhost:5173)
- **GraphQL API** → [http://localhost:4000/graphql](http://localhost:4000/graphql)

On first startup, the server will automatically crawl the configured `CLINIC_URL` and build the RAG knowledge base. This may take a few minutes. Progress is logged in the terminal. Subsequent startups will skip the crawl if the data is less than 3 months old.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend and backend concurrently |
| `npm run dev` | Start only the Vite frontend dev server |
| `npm run dev:server` | Start only the Express/GraphQL backend |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project Structure

```
chatbot-widget/
├── src/
│   ├── App.tsx                    # Main app with routing & layout
│   ├── main.tsx                   # React entry point
│   ├── frontend/
│   │   ├── assets/                # Images (bot avatar, hero image, etc.)
│   │   ├── components/
│   │   │   ├── ChatWidget.tsx     # Floating chat widget
│   │   │   ├── TextBox/           # Chat message box & mutations
│   │   │   ├── GreetingNotification.tsx
│   │   │   └── ServiceBox.tsx
│   │   ├── pages/                 # Route pages (AboutUs, BookNow)
│   │   └── types/                 # Frontend TypeScript types
│   └── server/
│       ├── index.ts               # Express + Apollo Server entry point
│       ├── lib/
│       │   └── rag.ts             # RAG pipeline (crawl, embed, chat)
│       ├── resolvers/             # GraphQL resolvers
│       ├── schemas/               # GraphQL type definitions
│       ├── types/                 # Server TypeScript types
│       └── utils/                 # Helper utilities
├── .env.local                     # Environment variables (git-ignored)
├── index.html                     # Vite HTML entry
├── vite.config.ts                 # Vite + TailwindCSS config
├── package.json
└── tsconfig.json
```

## How the RAG Pipeline Works

1. **Crawl** — On server start, Playwright crawls the target website (up to 30 pages), following internal links.
2. **Chunk** — Page content is split into overlapping 1,000-character chunks using LangChain's `RecursiveCharacterTextSplitter`.
3. **Embed** — Each chunk is embedded into a vector using Ollama's `nomic-embed-text` model.
4. **Store** — Vectors are stored in ChromaDB for fast similarity search.
5. **Query** — When a user sends a message, the most relevant chunks are retrieved and passed as context to the `qwen3:8b` LLM, which generates a grounded answer.

If the RAG system is unavailable (e.g. ChromaDB is down), the chatbot falls back to a direct LLM call with a built-in system prompt.

> For more detail, see [RAG_DOCUMENTATION.md](./RAG_DOCUMENTATION.md).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Connection refused` on port 8000 | Make sure ChromaDB is running (`docker run -p 8000:8000 chromadb/chroma`) |
| `Connection refused` on port 11434 | Make sure Ollama is running (`ollama serve`) |
| Crawl times out | Check that the target URL in `.env.local` is correct and reachable |
| `browserType.launch` error | Run `npx playwright install chromium` to install browser binaries |
| RAG data is stale | Delete the ChromaDB collection and restart the server to re-crawl |
