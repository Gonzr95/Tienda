import { z } from 'zod';

export const createSchema = z.object({
    name: z.
    string().
    min(1, 'Name is required')
});

export const updateSchema = z.object({
    name: z.
    string().
    min(1)
});

export const deleteSchema = z.object({
    name: z.
    string().
    min(1),

    id: z.
    coerce.number()
});

export const getBrandsQuerySchema = z.object({
    page: z
    .coerce
    .number()
    .min(1)
    .default(1),

    limit: z
    .coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

    sort: z
    .enum(['ASC', 'DESC', 'asc', 'desc'])
    .default('ASC')
    .transform((val) => val.toUpperCase())
});
