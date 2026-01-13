import { Brand } from "../models/brand.js";



export async function checkBrandExistenceByName( brandName ) {
    const existingBrand = await Brand.findOne({ 
        where: {
            name: brandName
        }
    });
    
    if (existingBrand) {
        throw new Error("BRAND_EXISTS");
    }
}

export async function checkBrandExistenceById( brandId ) {
    const existingBrand = await Brand.findOne({ 
        where: {
            id: brandId
        }
    });
    
    return existingBrand;
}



