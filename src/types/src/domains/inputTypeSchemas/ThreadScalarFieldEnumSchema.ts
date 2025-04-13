import { z } from 'zod';

export const ThreadScalarFieldEnumSchema = z.enum(['id','userId','title','isPublic','isClosed','ogpTitle','ogpDescription','ogpImagePath','createdAt','updatedAt','lastPostedAt']);

export default ThreadScalarFieldEnumSchema;
