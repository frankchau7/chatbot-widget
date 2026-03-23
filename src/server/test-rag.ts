import { setupRAG, chatWithRAG } from "./lib/rag";

async function test() {
  const testUrl = "https://www.melbournedental.com.au/"; // Or any other local URL for testing
  console.log(`--- Testing RAG with ${testUrl} ---`);

  try {
    console.log("Step 1: Running setupRAG (Crawl & Embed)...");
    await setupRAG(testUrl);
    console.log("✅ setupRAG completed successfully.\n");

    const questions = [
      "What is the address of Melbourne Dental?",
      "How much is a dental checkup?",
      "What are the opening hours?"
    ];

    for (const question of questions) {
      console.log(`Step 2: Testing chatWithRAG for question: "${question}"`);
      const response = await chatWithRAG(question);
      console.log(`🤖 Response: ${response}\n`);
    }

    console.log("--- RAG Test Finished Successfully ---");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ RAG Test Failed:", error.message);
    } else {
      console.error("❌ RAG Test Failed with unknown error.");
    }
    process.exit(1);
  }
}

test();
