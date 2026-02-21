import { Brand } from "../models/brand.js";
import { 
    checkBrandExistenceByName,
    checkBrandExistenceById

}
from '../services/brandService.js';

export async function createBrand(req, res) {
    try {
        const { name } = req.body;
        const existingBrand = await checkBrandExistenceByName( name );
        if(existingBrand) {
            return res.status(409).json({
                message: 'Brand already exists in the system'
            });
        } 
        const newBrand = await Brand.create({ name });

        return res.
            status(201).
            json({
                message: 'Brand created successfully',
                brand: newBrand
            });

    } catch (error) {
        console.error('Error creating brand:', error);
        // Manejo de error específico para marca existente
        if (error.message === "BRAND_EXISTS") {
            return res.status(409).json({ // 409 = Conflict
                message: 'Brand already exists in the system'
            });
        }
        // Error genérico para cualquier otra cosa
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message
        });
    }
}

//check de id, check de nombre, update, save
export async function updateBrand(req, res) {
    try {
        const { id } = req.params;
        const existingBrand = await checkBrandExistenceById( id );
        if (!existingBrand) {
            return res.status(404).json({
                message: 'Brand not found'
            });
        }

        const { name } = req.body;
        await checkBrandExistenceByName( name );
        existingBrand.name = name;
        const brand = await existingBrand.save();

        return res.
            status(200).
            json({
                message: 'Brand updated successfully',
                brand: brand
            });
    } catch (error) {
        console.error('Error updating brand:', error);
        if (error.message === "BRAND_EXISTS") {
            return res.status(409).json({ // 409 = Conflict
                message: 'Brand already exists in the system'
            });
        }
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });

    }
}

export async function deleteBrand(req, res) {   
    try {
        const { id, name } = req.body;

        const brandToDelete = await Brand.findOne({ 
            where: { 
                id, 
                name
            }   
        });
        if (!brandToDelete) {
            return res.status(404).json({
                message: 'Brand not found'
            });
        }



        await brandToDelete.destroy();
        return res.
            status(200).
            json({
                message: 'Brand deleted successfully'
            });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}



export async function getBrands(req, res) {
    try {
        let {
            page = 1,
            limit = 10,
            sort = 'ASC'
        } = req.query;

        const orderDirection = sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // 🔵 CASO 1: Traer todas las marcas
        if (limit === 'all') {

            const brands = await Brand.findAll({
                order: [['name', orderDirection]]
            });

            return res.status(200).json({
                brands: brands,
                pagination: {
                    totalItems: brands.length,
                    totalPages: 1,
                    currentPage: 1,
                    itemsPerPage: brands.length
                }
            });
        }

        // 🔵 CASO 2: Paginación normal

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        const { count, rows: brands } = await Brand.findAndCountAll({
            order: [['name', orderDirection]],
            limit: limit,
            offset: offset
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            brands: brands,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });

    }
    catch (error) {
        console.error('Error getting brands:', error);
        return res.status(500).json({ 
            message: 'Error al obtener las marcas',
            error: error.message 
        });
    }
}