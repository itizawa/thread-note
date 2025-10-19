import { z } from 'zod';

/////////////////////////////////////////
// LLM TOKEN USAGE SCHEMA
/////////////////////////////////////////

export const LLMTokenUsageSchema = z.object({
  id: z.cuid(),
  userId: z.string(),
  promptTokens: z.number().int(),
  completionTokens: z.number().int(),
  totalTokens: z.number().int(),
  createdAt: z.coerce.date(),
})

export type LLMTokenUsage = z.infer<typeof LLMTokenUsageSchema>

export default LLMTokenUsageSchema;
