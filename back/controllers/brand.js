import { Brand } from "../models/brand";
import { 
    checkBrandExistence
}
from '../services/brandService.js';

export async function createBrand(req, res) {
    try {
        const { name } = req.body;
        await checkBrandExistence( name );

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
