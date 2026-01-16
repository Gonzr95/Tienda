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

router.post('/brands', validate.body(createSchema), createBrand);
// :path parmeter, to identify which brand to update. Also tells router that what comes after is variable
// ?queryParams: purpose is to send strings to filter, sort or paginate resources
router.put('/brands/:id', validate.body(updateSchema), updateBrand);
router.get('/brands', validate.query(getBrandsQuerySchema), getBrands);
router.delete('/brands', validate.body(deleteSchema), deleteBrand);

export { router };
