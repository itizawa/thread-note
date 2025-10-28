import { z } from 'zod';

export const WorkSpaceScalarFieldEnumSchema = z.enum(['id','ownerId','name','slug','image','createdAt','updatedAt']);

export default WorkSpaceScalarFieldEnumSchema;
