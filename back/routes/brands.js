import { Router } from 'express';
const router = Router();
import { validate } from "../middlewares/validator.js";

import { 
    getBrands, createBrand, 
    updateBrand, deleteBrand
} from '../controllers/brand.js';

import { 
    createSchema, updateSchema, 
    getBrandsQuerySchema, deleteSchema
} from "../schemas/brands.js";


// ****** RUTAS ******
router.post('/brands', validate.body(createSchema), createBrand);
// CONCEPTO NUEVO
router.put('/brands/:id', validate.body(updateSchema), updateBrand);
router.get('/brands', validate.query(getBrandsQuerySchema), getBrands);
router.delete('/brands', validate.body(deleteSchema), deleteBrand);

export { router };
