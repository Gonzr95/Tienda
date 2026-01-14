import { Router } from 'express';
const router = Router();
import { upload } from "../middlewares/upload.js";
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



router.post('/products', 
    upload.array("images", 5), 
    validateBodySchema(createSchema), 
    createProduct);



export { router };