import { Brand } from './brand.js';
import { Product } from './product.js';
import { Ticket } from './ticket.js';
import { User } from './user.js';
import { Product_Ticket } from './product_ticket.js';

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

    // Relación: Un Producto pertenece a muchos Tickets
    // Other keys evita duplicados en las asociaciones
    Product.belongsToMany(Ticket, { 
        through: Product_Ticket, 
        foreignKey: 'productID', // La llave en la tabla intermedia que apunta a Product
        otherKey: 'ticketID'     // La llave en la tabla intermedia que apunta a Ticket
    });

    // Relación: Un Ticket pertenece a muchos Productos
    Ticket.belongsToMany(Product, { 
        through: Product_Ticket, 
        foreignKey: 'ticketID',  // La llave en la tabla intermedia que apunta a Ticket
        otherKey: 'productID'    // La llave en la tabla intermedia que apunta a Product
    });

    // 1️⃣ Un Cliente tiene muchos Tickets
    User.hasMany(Ticket, {
        foreignKey: 'clienteId',   // Columna en la tabla Ticket
        as: 'tickets',             // Alias para eager loading
        onDelete: 'RESTRICT',      // Evita borrar el cliente si tiene tickets
        onUpdate: 'CASCADE'        // Si cambia el ID del cliente, se actualiza en tickets
    });

    // 2️⃣ Un Ticket pertenece a un Cliente
    Ticket.belongsTo(User, {
        foreignKey: 'clienteId',
        as: 'client'
    });





    console.log('--- Asociaciones de modelos configuradas correctamente ---');
};