import { Product } from "../models/Product.js";

export async function checkProductExistenceByName({ productData } ) {
    const existingProduct = await Product.findOne({
        where: {
            name: productData.name,
            lineUp: productData.lineUp,
            description: productData.description
        }
    });
    
    return existingProduct;


}