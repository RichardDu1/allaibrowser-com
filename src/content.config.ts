import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviewsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    platform: z.enum(['browser-use', 'stagehand', 'playwright', 'puppeteer', 'agentql', 'browserbase', 'selenium', 'cypress', 'other']),
    score: z.number().min(0).max(10),
    openSource: z.boolean(),
    githubUrl: z.string().optional(),
    githubStars: z.number().optional(),
    pricing: z.enum(['free', 'freemium', 'paid', 'enterprise']),
    verdictLabel: z.enum(['buy', 'wait', 'skip']),
    featured: z.boolean().default(false),
    useCases: z.array(z.string()),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    publishedAt: z.date(),
  }),
});

const toolsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    platform: z.enum(['browser-use', 'stagehand', 'playwright', 'puppeteer', 'agentql', 'browserbase', 'selenium', 'cypress', 'other']),
    score: z.number().min(0).max(10),
    openSource: z.boolean(),
    githubUrl: z.string().optional(),
    githubStars: z.number().optional(),
    pricing: z.enum(['free', 'freemium', 'paid', 'enterprise']),
    verdictLabel: z.enum(['buy', 'wait', 'skip']),
    featured: z.boolean().default(false),
    useCases: z.array(z.string()),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    publishedAt: z.date(),
  }),
});

const comparisonsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/comparisons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    products: z.array(z.string()),
    winner: z.string(),
    scoreA: z.number().min(0).max(10),
    scoreB: z.number().min(0).max(10),
    prosA: z.array(z.string()),
    prosB: z.array(z.string()),
    consA: z.array(z.string()),
    consB: z.array(z.string()),
    bestFor: z.string(),
    publishedAt: z.date(),
  }),
});

const bestOfsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/best-ofs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['web-agents', 'browser-automation', 'ai-scraping', 'testing-tools', 'browser-extensions']),
    items: z.array(z.object({
      name: z.string(),
      platform: z.enum(['browser-use', 'stagehand', 'playwright', 'puppeteer', 'agentql', 'browserbase', 'selenium', 'cypress', 'other']),
      score: z.number(),
      reason: z.string(),
    })),
    publishedAt: z.date(),
  }),
});

export const collections = {
  'reviews': reviewsCollection,
  'tools': toolsCollection,
  'comparisons': comparisonsCollection,
  'best-ofs': bestOfsCollection,
};