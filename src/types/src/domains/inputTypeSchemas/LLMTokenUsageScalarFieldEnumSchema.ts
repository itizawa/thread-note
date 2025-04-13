import { z } from 'zod';

export const LLMTokenUsageScalarFieldEnumSchema = z.enum(['id','userId','promptTokens','completionTokens','totalTokens','createdAt']);

export default LLMTokenUsageScalarFieldEnumSchema;
