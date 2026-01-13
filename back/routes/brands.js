import { Router } from 'express';
const router = Router();
import { getBrands, createBrand } from '../controllers/brands.js';
import { createBrand } from "../schemas/brands.js";
import { validateSchema } from "../middlewares/validator.js";

router.post('/brands', validateSchema(createBrand), createBrand);
router.put('/brands/:id', validateSchema(updateBrand), updateBrand);
router.delete('/brands/:id', validateSchema(deleteBrand), deleteBrand);
router.get('/brands', getBrands);

