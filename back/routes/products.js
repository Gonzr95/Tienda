import { Router } from 'express';
const router = Router();
import { 
    validateBodySchema,
    validateQuerySchema
} from "../middlewares/validator.js";
import {
    createProduct,

} from '../controllers/product.js';
import { 
    createSchema, 
} from "../schemas/products.js";



router.post('/products', validateBodySchema(createSchema), createProduct);


export { router };