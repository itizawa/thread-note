import { z } from 'zod';

export const ThreadScalarFieldEnumSchema = z.enum(['id','userId','title','isPublic','status','ogpTitle','ogpDescription','ogpImagePath','createdAt','updatedAt','lastPostedAt']);

export default ThreadScalarFieldEnumSchema;
