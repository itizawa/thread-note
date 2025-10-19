import { z } from 'zod';

/////////////////////////////////////////
// PLAN SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const PlanSubscriptionSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  planId: z.string(),
})

export type PlanSubscription = z.infer<typeof PlanSubscriptionSchema>

export default PlanSubscriptionSchema;
