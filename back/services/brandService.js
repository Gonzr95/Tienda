import { Brand } from "../models/brand.js";



export async function checkBrandExistence( brandName ) {
    const existingBrand = await Brand.findOne({ 
        where: {
            name: brandName
        }
    });
    
    if (existingBrand) {
        throw new Error("BRAND_EXISTS");
    }
}


