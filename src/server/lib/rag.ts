import { chromium, type Browser } from "playwright";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOllama } from "@langchain/ollama";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

export async function scrapeWebsite(url: string, browser?: Browser): Promise<{ text: string, links: string[] }> {
  let internalBrowser = browser;
  let shouldClose = false;
  let page;
  try {
    if (!internalBrowser) {
      internalBrowser = await chromium.launch({ headless: true });
      shouldClose = true;
    }
    page = await internalBrowser.newPage();
    
    // Set a reasonable navigation timeout
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    
    // Extract text and clean it, also get links
    const data = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"))
        .map(a => a.href)
        .filter(href => {
          try {
            return href.startsWith("http");
          } catch {
            return false;
          }
        });

      // Remove noise elements
      const noise = document.querySelectorAll("script, style, nav, footer, header, noscript, iframe");
      noise.forEach(s => s.remove());
      
      return {
        text: document.body.innerText,
        links: links
      };
    });
    
    return {
      text: data.text.replace(/\s+/g, " ").trim(),
      links: data.links
    };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.warn(`Timeout while scraping ${url}. The page might be too slow or heavy.`);
    } else {
      console.error(`Error scraping ${url}:`, (error as Error).message || error);
    }
    return { text: "", links: [] };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error("Error closing page:", e);
      }
    }
    if (shouldClose && internalBrowser) {
      try {
        await internalBrowser.close();
      } catch (e) {
        console.error("Error closing browser:", e);
      }
    }
  }
}

export async function crawlWebsite(rootUrl: string, maxPages: number = 20): Promise<Document[]> {
  const visited = new Set<string>();
  const toVisit = [rootUrl];
  const allDocs: Document[] = [];
  let domain: string;
  
  try {
    domain = new URL(rootUrl).hostname;
  } catch {
    console.error(`Invalid root URL provided for crawling: ${rootUrl}`);
    return [];
  }

  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    console.error("Failed to launch browser for crawling:", error);
    return [];
  }
  
  try {
    while (toVisit.length > 0 && visited.size < maxPages) {
      const url = toVisit.shift()!;
      
      let normalizedUrl;
      try {
        // Normalize URL (remove hash and trailing slash)
        normalizedUrl = url.split("#")[0].replace(/\/$/, "");
      } catch {
        continue;
      }
      
      if (visited.has(normalizedUrl)) continue;
      visited.add(normalizedUrl);
      
      console.log(`Crawling (${visited.size}/${maxPages}): ${normalizedUrl}`);
      try {
        const { text, links } = await scrapeWebsite(normalizedUrl, browser);
        
        if (text) {
          const splitter = new RecursiveCharacterTextSplitter({ 
            chunkSize: 1000,
            chunkOverlap: 200 
          });
          const chunks = await splitter.splitText(text);
          const docs = chunks.map(chunk => new Document({ 
            pageContent: chunk, 
            metadata: { source: normalizedUrl } 
          }));
          allDocs.push(...docs);
        }

        // Find new internal links
        for (const link of links) {
          try {
            const linkUrl = new URL(link);
            const normalizedLink = link.split("#")[0].replace(/\/$/, "");
            if (linkUrl.hostname === domain && !visited.has(normalizedLink) && !toVisit.includes(normalizedLink)) {
              toVisit.push(normalizedLink);
            }
          } catch {
            // Skip invalid URLs silently
          }
        }
      } catch (scrapeError) {
        console.error(`Failed to process page ${normalizedUrl}:`, scrapeError);
        // Continue to next page
      }
    }
  } catch (error) {
    console.error("Unexpected error during website crawl:", error);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("Error closing crawler browser:", e);
      }
    }
  }
  
  return allDocs;
}

export async function setupRAG(websiteUrl: string) {
  try {
    console.log(`Starting crawl of ${websiteUrl}...`);
    const docs = await crawlWebsite(websiteUrl);
    
    if (docs.length === 0) {
      console.warn("No documents found during crawl. RAG might not have any context.");
      return;
    }
    
    console.log(`Crawl complete. Found ${docs.length} document chunks from across the site.`);
    
    console.log("Initialising embeddings and vector store...");
    const embeddings = new OllamaEmbeddings({ 
      model: "nomic-embed-text",
      baseUrl: OLLAMA_BASE_URL
    });
    
    await Chroma.fromDocuments(docs, embeddings, { 
      collectionName: "clinic",
      url: CHROMA_URL
    });
    console.log("✅ RAG storage setup complete.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in setupRAG:", errorMessage);
    throw error; // Re-throw so the caller knows it failed
  }
}

export async function chatWithRAG(question: string) {
  try {
    const embeddings = new OllamaEmbeddings({ 
      model: "nomic-embed-text",
      baseUrl: OLLAMA_BASE_URL
    });

    const vectorStore = await Chroma.fromExistingCollection(embeddings, { 
      collectionName: "clinic",
      url: CHROMA_URL
    });
    
    const retriever = vectorStore.asRetriever();
    
    const llm = new ChatOllama({ 
      model: "qwen3:8b",
      baseUrl: OLLAMA_BASE_URL
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are an AI dental clinic receptionist for the company in the following context:
      <context>
      {context}
      </context>
      Keep replies to 100 words or less, friendly like reception staff. 
      Off-topic? "Sorry, I handle dental bookings only! What service can I help with?" Always offer to book.
      Question: {question}
    `);

    const chain = await createStuffDocumentsChain({ 
      llm, 
      prompt 
    });
    
    const context = await retriever.invoke(question);
    
    if (!context || context.length === 0) {
      console.warn("No relevant context found in vector store for the question.");
    }
    
    return await chain.invoke({ 
      question,
      context
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in chatWithRAG:", errorMessage);
    throw error;
  }
}
