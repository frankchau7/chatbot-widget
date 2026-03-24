import {type Browser, chromium} from "playwright";
import {ChatOllama, OllamaEmbeddings} from "@langchain/ollama";
import {Chroma} from "@langchain/community/vectorstores/chroma";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {createStuffDocumentsChain} from "@langchain/classic/chains/combine_documents";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Document} from "@langchain/core/documents";
import {ChromaClient} from "chromadb";
import {formatWebsiteUrlToCompanyName} from "../utils";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const CLINIC_URL = process.env.CLINIC_URL || "https://claytondentalclinic.com.au/";

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

/**
 * Normalizes a URL by removing any fragment identifier and trailing slashes.
 * @param url the link to the website it is crawling
 */
export function normalizeUrl(url: string): string {
  return url
    .replace(/^http:\/\//, "https://")
    .split("#")[0]
    .replace(/\/$/, "");
}

/**
 * Crawls a website and extracts text and links.
 * @param rootUrl the website it is crawling
 * @param maxPages the maximum number of pages to crawl (default: 30)
 */
export async function crawlWebsite(rootUrl: string, maxPages: number = 30): Promise<Document[]> {
  const visited = new Set<string>();
  const queued = new Set<string>([normalizeUrl(rootUrl)]);
  const toVisit = [normalizeUrl(rootUrl)];
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
      const normalizedUrl = toVisit.shift()!;

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
            const normalizedLink = normalizeUrl(link);
            if (linkUrl.hostname === domain && !visited.has(normalizedLink) && !queued.has(normalizedLink)) {
              toVisit.push(normalizedLink);
              queued.add(normalizedLink);
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
    const client: ChromaClient = new ChromaClient({path: CHROMA_URL});
    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text",
      baseUrl: OLLAMA_BASE_URL
    });

    const clinicName = formatWebsiteUrlToCompanyName(websiteUrl);

    try {
      const clinicCol = await client.getCollection({name: clinicName});

      if (clinicCol?.metadata?.lastUpdated) {
        const lastUpdated = new Date(clinicCol.metadata.lastUpdated as string);
        const now = new Date();
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

        if (lastUpdated >= threeMonthsAgo) {
          console.log(`✅ RAG storage is fresh (last updated: ${lastUpdated.toISOString()}). Skipping crawl.`);
          return;
        }

        console.log(`⏳ RAG storage is stale (last updated: ${lastUpdated.toISOString()}). Re-crawling...`);
      }

      // Collection exists but is stale or has no lastUpdated — delete it
      await client.deleteCollection({name: clinicName});
    } catch {
      // Collection doesn't exist yet
      console.log("🆕 No existing RAG storage found. Crawling for the first time...");
    }

    const docs = await crawlWebsite(websiteUrl);

    if (docs.length === 0) {
      console.warn("No documents found during crawl. RAG might not have any context.");
      return;
    }

    console.log(`Crawl complete. Found ${docs.length} document chunks from across the site.`);

    console.log("Initialising embeddings and vector store...");
    const texts = docs.map(d => d.pageContent);
    const docEmbeddings = await embeddings.embedDocuments(texts);
    const ids = docs.map((_, i) => `${clinicName}_doc_${Date.now()}_${i}`);
    const now = new Date().toISOString();

    const collection = await client.getOrCreateCollection({
      name: clinicName,
      metadata: { lastUpdated: now }
    });

    await collection.add({
      ids,
      embeddings: docEmbeddings,
      documents: texts,
      metadatas: docs.map(d => ({
        ...d.metadata,
        lastUpdated: now,
        chunkIndex: d.metadata?.chunkIndex || 0
      }))
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

    const clinicName = formatWebsiteUrlToCompanyName(CLINIC_URL);

    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: clinicName,
      url: CHROMA_URL
    });

    const retriever = vectorStore.asRetriever();

    const llm = new ChatOllama({
      model: "qwen3:8b",
      baseUrl: OLLAMA_BASE_URL
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a dental clinic receptionist texting a patient. 
      
      Context: {context}
      
      **TEXT MESSAGE RULES** (follow exactly):
      1. NO asterisks **bold** or formatting EVER  
      2. NO "Hello!", "Hi!", intros - jump straight to answering
      3. Casual text style like human receptionist: short sentences, normal punctuation
      4. Casual prices: "$1000" not "**$1000**" 
      5. End with booking offer only if relevant
      
      Keep under 150 words. Off-topic: "Sorry, I'm here to assist with questions about the dental clinic! What service can I help with?"
      
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
