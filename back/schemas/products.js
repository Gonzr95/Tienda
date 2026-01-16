import { z } from 'zod';

export const createSchema = z.object({
    name: z
    .string()
    .nonempty()
    .min(2)
    .max(32),

    brandName: z.
    string()
    .nonempty()
    .min(2)
    .max(32),

    lineUp: z
    .string()
    .nonempty()
    .min(3)
    .max(32),

    description: z
    .string()
    .nonempty()
    .min(2)
    .max(64),
 
    stock: z.
    coerce.number()
    .nonnegative(),
    
    price: z.
    coerce.number()
    .nonnegative(),

    isActive: z
    .enum(["true", "false"], {
    errorMap: () => ({
      message: "isActive debe ser 'true' o 'false'"
    })
    })
    .transform(v => v === "true")
});

export const getProductsQuerySchema = z.object({
    page: z.coerce
    .number()
    .min(1)
    .default(1),

    limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

    sortBy: z
    .enum(['id', 'name', 'price', 'brand', 'price', 'isActive'])
    .default('id')
    .optional(),

    sortOrder: z
    .enum(['ASC', 'DESC', 'asc', 'desc'])
    .default('ASC')
    .transform((val) => val.toUpperCase()),

    // --- FILTROS ---

    id: z.coerce
    .number()
    .optional(),

    brand: z
      .string()
      .trim()
      .optional(),

    isActive: z
    .enum(["true", "false"])
    .optional()
    .transform(v => v === "true"),

    // Para el precio, usualmente es mejor manejar rangos (min/max)
    minPrice: z.coerce
      .number()
      .min(0)
      .optional(),

    maxPrice: z.coerce
      .number()
      .min(0)
      .optional()
})