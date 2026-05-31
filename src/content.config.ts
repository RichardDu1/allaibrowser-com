import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviewsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    agentType: z.string(), // e.g., "Headless Browser", "LLM Framework", "Browser Extension"
    domParsingSpeed: z.string(), // e.g., "14.2s"
    captchaBypassRate: z.string(), // e.g., "89%"
    successRate: z.string(), // e.g., "96%"
    tokenCostPerTask: z.string(), // e.g., "12k tokens"
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    githubUrl: z.string().optional(),
    publishedAt: z.date()
  }),
});

export const collections = {
  'reviews': reviewsCollection,
};
