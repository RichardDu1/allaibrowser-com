import fs from 'fs';
import path from 'path';
import { fetchSearchContext } from './web_crawler.mjs';

const DEEPSEEK_API_KEY = "sk-a2dc0881aaac4bfcbe75b200177655b1";
const REVIEWS_DIR = path.join(process.cwd(), 'src', 'content', 'reviews');

if (!fs.existsSync(REVIEWS_DIR)) fs.mkdirSync(REVIEWS_DIR, { recursive: true });

function sanitizeSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function callDeepSeek(prompt) {
  const reqBody = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" }
  };

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(reqBody)
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function generateAgent(agentName) {
  console.log(`\n======================================================`);
  console.log(`🤖 Benchmarking Agent: ${agentName}`);
  
  // 1. Crawl for facts
  console.log(`🔍 Crawling GitHub and Docs for ${agentName}...`);
  let searchResults = "";
  try {
    searchResults = await fetchSearchContext(`"${agentName}" AI web browser agent playwright headless github benchmark success rate`);
  } catch (e) {
    console.warn(`⚠️ Crawl failed: ${e.message}`);
  }

  // 2. Ask DeepSeek to generate Schema + Markdown
  console.log(`🧠 Generating structured Benchmark Review...`);
  const prompt = `
You are a Senior QA Automation Engineer writing for AllAIBrowser.com, a cyberpunk-themed benchmark site.
Write an exhaustive, highly technical review for the AI web automation agent: "${agentName}".

I have scraped the web for factual data. Here are the snippets:
---
${searchResults}
---

Your task is to output a single JSON object containing BOTH the frontmatter metadata and the full markdown review.
Ensure all data is as factual as possible based on the snippets (or your internal knowledge of this agent). Be highly technical (mention DOM parsing, Playwright, Chromium, stealth plugins, token usage, LLM models).

Output exactly this JSON structure (no markdown fences around it, just raw JSON):
{
  "title": "Exact Agent Name",
  "description": "2-3 sentence technical summary of its architecture and primary use case.",
  "agentType": "Headless Browser, LLM Framework, or Browser Extension",
  "domParsingSpeed": "e.g., 14.2s or 3.5s",
  "captchaBypassRate": "e.g., 89% or 45%",
  "successRate": "e.g., 96% or 72%",
  "tokenCostPerTask": "e.g., 12k tokens or $0.05",
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "githubUrl": "https://github.com/...",
  "markdownContent": "The full detailed technical review in Markdown. Include H2s like '## Architecture Breakdown', '## Benchmarks & Telemetry', '## Developer Experience'. Do not include the title (H1) or frontmatter."
}
`;

  const responseJson = await callDeepSeek(prompt);
  let parsed;
  try {
    parsed = JSON.parse(responseJson);
  } catch (e) {
    console.error("❌ Failed to parse output:", responseJson);
    return;
  }

  // 3. Write File
  const slug = sanitizeSlug(parsed.title);
  const filePath = path.join(REVIEWS_DIR, `${slug}.md`);
  const dateStr = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: "${parsed.title.replace(/"/g, '\\"')}"
description: "${parsed.description.replace(/"/g, '\\"')}"
agentType: "${parsed.agentType}"
domParsingSpeed: "${parsed.domParsingSpeed}"
captchaBypassRate: "${parsed.captchaBypassRate}"
successRate: "${parsed.successRate}"
tokenCostPerTask: "${parsed.tokenCostPerTask}"
pros: ${JSON.stringify(parsed.pros || [])}
cons: ${JSON.stringify(parsed.cons || [])}
githubUrl: "${parsed.githubUrl || ''}"
publishedAt: ${dateStr}
---

${parsed.markdownContent}
`;

  fs.writeFileSync(filePath, frontmatter, 'utf-8');
  console.log(`   ✅ Created deep-dive benchmark: ${slug}.md`);
}

async function run() {
  const agents = ["Browser Use", "Stagehand", "MultiOn", "AutoGPT", "Skyvern"];
  
  for (const agent of agents) {
    await generateAgent(agent);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`\n🎉 Batch complete! Generated benchmarks for ${agents.length} Agents.`);
}

run();
