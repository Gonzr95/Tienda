import { z } from 'zod';

export const createBrand = z.object({
    name: z.
    string().
    min(1, 'Name is required')
});

export const updateBrand = z.object({
    name: z.
    string().
    min(1)
});

export const deleteBrand = z.object({
    
});