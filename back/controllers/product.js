import { checkBrandExistenceByName } from '../services/brandService.js';
import { checkProductExistenceByName, checkImages, 
         createFolder, saveImages } from '../services/productService.js';
import { Product } from '../models/Product.js';


/*
    check que la marca exista
    si no existe, error 404
    chequear si el producto existe
    si existe, error 409
    si no existe procedo a guardar las imagenes
    crear el producto
*/
export async function createProduct(req, res) {
    try {
        const existingBrand = await checkBrandExistenceByName( req.body.brandName );
        if (!existingBrand) {
            return res.status(404).json({
                message: 'Brand not found'
            });
        }
        
        const existingProduct = await checkProductExistenceByName({ productData: req.body });
        if (existingProduct) {
            return res.status(409).json({
                message: 'Product already exists'
            });
        }

        const { name, lineUp, description, price, stock, isActive } = req.body;
        const files = req.files;
        await checkImages(files);
        const targetFolder = await createFolder(productData);
        const imagePaths = await saveImages(files, targetFolder);

        const newProduct = await Product.create({
            name,
            brandId: existingBrand.id,
            lineUp,
            description,
            price,
            stock,
            isActive,
            images: imagePaths, // Array de rutas de imágenes
            productFolder: targetFolder // Ruta base de la carpeta para tareas de mantenimiento
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
