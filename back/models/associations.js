import { Brand } from './brand.js';
import { Product } from './product.js';

export const setupAssociations = () => {
    // 1. Una Marca tiene muchos Productos
    Brand.hasMany(Product, {
        foreignKey: 'brandId', // Nombre de la columna en la tabla Product
        as: 'products',        // Alias para cuando hagas consultas (Eager Loading)
        onDelete: 'RESTRICT',  // Evita borrar la marca si hay productos
        onUpdate: 'CASCADE'    // Si el ID de la marca cambia, se actualiza en los productos
    });

    // 2. Un Producto pertenece a una Marca
    Product.belongsTo(Brand, {
        foreignKey: 'brandId',
        as: 'brand'            // Alias para acceder a la marca desde el producto
    });

    console.log('--- Asociaciones de modelos configuradas correctamente ---');
};