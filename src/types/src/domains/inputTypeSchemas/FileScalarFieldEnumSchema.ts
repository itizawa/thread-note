import { z } from 'zod';

export const FileScalarFieldEnumSchema = z.enum(['id','userId','name','path','size','createdAt']);

export default FileScalarFieldEnumSchema;
