import { checkBrandExistenceByName } from '../services/brandService.js';
import { checkProductExistenceByName } from '../services/productService.js';
import { Product } from '../models/Product.js';

export async function createProduct(req, res) {
    //check que la marca exista
    //si no existe, error 404
    //chequear si el producto existe
    //si existe, error 409
    //crear el producto

    try {
        const existingBrand = await checkBrandExistenceByName( req.body.brandName );
        if (!existingBrand) {
            return res.status(404).json({
                message: 'Brand not found'
            });
        }

        const { name, lineUp, description, price, stock, isActive } = req.body;

        
        const existingProduct = await checkProductExistenceByName({ productData: req.body });
        if (existingProduct) {
            return res.status(409).json({
                message: 'Product already exists'
            });
        }

        const newProduct = await Product.create({
            name,
            brandId: existingBrand.id,
            lineUp,
            description,
            price,
            stock,
            isActive
        });
        
        return res.
            status(201).
            json({
                message: 'Product created successfully',
                product: newProduct
            });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message
        });
    }
}
