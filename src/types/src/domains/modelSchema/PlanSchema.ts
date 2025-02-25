import { z } from 'zod';

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type Plan = z.infer<typeof PlanSchema>

export default PlanSchema;
