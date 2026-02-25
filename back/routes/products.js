import { Router } from 'express';
const router = Router();
import { upload } from "../middlewares/multer.js";
import { validate } from "../middlewares/validator.js";
import { createSchema, getProductsQuerySchema } from "../schemas/products.js";
import { createProduct, getProducts, updateProduct, getCategories } from '../controllers/product.js';

router.post('/products', 
    upload.array("images", 5), 
    validate.body(createSchema), 
    createProduct);

router.get('/products', 
    validate.query(getProductsQuerySchema),
    getProducts);



router.put('/products/:id', 
    upload.array("images", 5), 
    validate.body(createSchema), 
    updateProduct);

router.get("/products/categories", getCategories);

export { router };