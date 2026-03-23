# RAG System Documentation (`rag.ts`)

The `rag.ts` module is the core of the chatbot's Retrieval-Augmented Generation (RAG) system. It allows the chatbot to answer user questions based on the specific content of a website by crawling, embedding, and retrieving relevant information.

## Overview

RAG (Retrieval-Augmented Generation) is a technique that combines the strengths of large language models (LLMs) with private or domain-specific data. Instead of relying solely on the LLM's pre-trained knowledge, the system "retrieves" relevant documents from a local database and "augments" the prompt with this context before generating a response.

## Key Components

### 1. Web Scraping & Crawling
- **`scrapeWebsite(url, browser?)`**: Uses **Playwright** to launch a headless browser and extract clean text from a specific URL. It filters out "noise" like scripts, styles, navigation bars, and footers to ensure only meaningful content is processed. It also extracts all internal links for crawling.
- **`crawlWebsite(rootUrl, maxPages)`**: A recursive crawler that starts at a root URL and discovers internal links within the same domain. It visits up to a defined limit (default: 20 pages) to build a comprehensive knowledge base of the entire site.

### 2. Data Processing (Ingestion)
- **Text Splitting**: Long pages are broken into smaller "chunks" (1,000 characters with 200-character overlap) using `RecursiveCharacterTextSplitter`. This ensures that the context provided to the AI is focused and stays within token limits.
- **Embeddings**: Each text chunk is converted into a mathematical vector using the `nomic-embed-text` model via **Ollama**. These vectors represent the semantic meaning of the text.
- **Vector Storage**: The vectors and their corresponding text chunks are stored in **ChromaDB**. This allows for extremely fast "similarity searches" later.

### 3. Initialization (`setupRAG`)
This function is called when the server starts. It:
1. Triggers the full website crawl.
2. Processes all discovered pages into chunks.
3. Generates embeddings for every chunk.
4. Stores everything in the ChromaDB collection named `"clinic"`.

### 4. Retrieval & Chat (`chatWithRAG`)
This is the main entry point for generating answers. When a user asks a question:
1. **Retrieval**: The system searches ChromaDB for the most relevant text chunks based on the question's meaning.
2. **Context Assembly**: The retrieved chunks are formatted into a "context" block.
3. **Prompting**: A specialized prompt is created that instructs the AI (`qwen3:8b`) to answer the question *only* using the provided context.
4. **Generation**: The AI generates a factual response based strictly on the website's data.

## Technologies Used

- **Playwright**: For robust web scraping and handling dynamic content.
- **LangChain**: For orchestration of the RAG pipeline, text splitting, and document chains.
- **Ollama**: For running local AI models (`qwen3:8b` for chat and `nomic-embed-text` for embeddings).
- **ChromaDB**: As the vector database for high-performance similarity search.

## Error Handling & Robustness

- **Browser Management**: Ensures browser instances and pages are closed correctly to prevent memory leaks.
- **Timeout Protection**: Includes a 30-second timeout for page loads to prevent the crawler from getting stuck.
- **Domain Locking**: The crawler only visits links within the same hostname to avoid wandering off to external sites.
- **Resiliency**: If a single page fails to load, the crawler skips it and continues with the rest of the site.
- **Fallback Mechanism**: The system is designed to work with the `sendMessage.resolver.ts`, which provides a direct LLM fallback if the RAG system (ChromaDB or Ollama) is unavailable.
