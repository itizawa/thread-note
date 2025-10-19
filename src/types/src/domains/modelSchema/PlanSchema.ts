import { z } from 'zod';

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.uuid(),
  name: z.string(),
})

export type Plan = z.infer<typeof PlanSchema>

export default PlanSchema;
