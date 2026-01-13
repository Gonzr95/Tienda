import { Router } from 'express';
const router = Router();
import { validateSchema } from "../middlewares/validator.js";
import { getBrands, createBrand, updateBrand } from '../controllers/brand.js';
import { createSchema, updateSchema } from "../schemas/brands.js";

router.post('/brands', validateSchema(createSchema), createBrand);
// :path parmeter, to identify which brand to update. Also tells router that what comes after is variable
// ?queryParams: purpose is to send strings to filter, sort or paginate resources
router.put('/brands/:id', validateSchema(updateSchema), updateBrand);
//router.delete('/brands/:id', validateSchema(deleteSchema), deleteBrand);
router.get('/brands', getBrands);

export { router };
