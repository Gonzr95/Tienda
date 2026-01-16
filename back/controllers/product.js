import { checkBrandExistenceByName } from '../services/brandService.js';
import { checkProductExistenceByName, checkImages, 
         createFolder, saveImages } from '../services/productService.js';
import { Product } from '../models/product.js';
import { Brand } from '../models/brand.js';
import { Op } from 'sequelize';


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
        
        const productData = {
            name: req.body.name,
            lineUp: req.body.lineUp,
            description: req.body.description
        }
        const existingProduct = await checkProductExistenceByName(productData);
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

export async function getProducts(req, res) {
    try{
        let {
            page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC',
            name, id, isActive, brand, minPrice, maxPrice
        } = req.query;
        page = parseInt(page); //corregir para double
        limit = parseInt(limit);//corregir para double

        

        const offset = (page - 1) * limit;
        const orderDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // 2. CONSTRUCCIÓN DINÁMICA DEL "WHERE"
        // Solo agregamos al filtro las propiedades que el usuario envió.
        const whereCondition = {};

        if ( isActive !== undefined ) {
            // Convertir a booleano
            if (isActive === 'true') {
                whereCondition.isActive = true;
            } else if (isActive === 'false') {
                whereCondition.isActive = false;
            }
        }

        if (id) whereCondition.id = id;
        
        // Usamos 'iLike' de Postgres si quieres búsqueda insensible a mayúsculas, 
        // o coincidencia exacta si prefieres. Aquí uso exacta para seguir tu ejemplo:
        if (brand) whereCondition.brand = brand;
        if (name) whereCondition.name = name;
        
        // Lógica para Rango de Precios (usando Operadores de Sequelize)
        if (minPrice || maxPrice) {
            whereCondition.price = {};
            // Op.gte = Greater Than or Equal (>=)
            if (minPrice) whereCondition.price[Op.gte] = minPrice;
            // Op.lte = Less Than or Equal (<=)
            if (maxPrice) whereCondition.price[Op.lte] = maxPrice;
        }

        console.log('Where Condition:', whereCondition);
        console.log(typeof whereCondition.isActive);
        // 4. CONSULTA A LA BASE DE DATOS
        const { count, rows: products } = await Product.findAndCountAll({
            where: whereCondition,
            include: [{
                model: Brand,
                as: "brand",
                attributes: ['name'] //traeme el nombre
            }],
            limit: limit,
            offset: offset,
            // Ordenamiento dinámico: [[columna, direccion]]
            order: [[sortBy, sortOrder]] 
        });


        // 5. PREPARAR RESPUESTA (Igual que tu ejemplo de Brand)
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            status: 'success',
            data: products, // Los productos encontrados
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit,
                // Metadata extra útil para saber qué filtros se aplicaron
                appliedFilters: {
                    sortBy,
                    sortOrder,
                    brand,
                    minPrice,
                    maxPrice
                }
            }
        });

    } catch (error) {
        // Manejo diferenciado de errores
        
        // Si el error viene de Zod (validación de datos)
        if (error.name === 'ZodError') {
            return res.status(400).json({ 
                error: 'Validation Error', 
                details: error.errors 
            });
        }

        // Error general de servidor o base de datos
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }

}

