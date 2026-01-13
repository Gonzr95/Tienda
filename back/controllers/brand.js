import { Brand } from "../models/brand.js";
import { 
    checkBrandExistenceByName,
    checkBrandExistenceById

}
from '../services/brandService.js';

export async function createBrand(req, res) {
    try {
        const { name } = req.body;
        await checkBrandExistenceByName( name );

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
        const { id } = req.params;
        const brand = await Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({
                message: 'Brand not found'
            });
        }
        await brand.destroy();
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
        const brands = await Brand.findAll();
        return res.
            status(200).
            json({
                message: 'Brands retrieved successfully',
                brands: brands
            });
    }
    catch (error) {
        console.error('Error retrieving brands:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message
        });
    }
}