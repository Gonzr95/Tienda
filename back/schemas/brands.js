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