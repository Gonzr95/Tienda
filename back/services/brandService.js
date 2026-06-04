import { Brand } from "../models/brand.js";



export async function checkBrandExistenceByName( brandName ) {
    const existingBrand = await Brand.findOne({ 
        where: {
            name: brandName
        }
    });
    

    return existingBrand;
}

export async function checkBrandExistenceById( brandId ) {
    const existingBrand = await Brand.findOne({ 
        where: {
            id: brandId
        }
    });
    
    return existingBrand;
}



