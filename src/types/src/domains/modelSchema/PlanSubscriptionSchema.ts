import { z } from 'zod';

/////////////////////////////////////////
// PLAN SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const PlanSubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  planId: z.string(),
})

export type PlanSubscription = z.infer<typeof PlanSubscriptionSchema>

export default PlanSubscriptionSchema;
