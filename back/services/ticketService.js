import { Ticket } from "../models/ticket.js";
import * as productService from "./productService.js";
import { Product_Ticket } from "../models/product_ticket.js";

// valida stock
// calcula total
// crea ticket
// decrementa el stock
export const createTicket = async (products, customer) => {

    // Validar productos y stock
    const validatedProducts = await productService.validateProductsAndStock(products);

    // Calcular total
    const total = calculateTotal(validatedProducts);

    // Crear ticket
    const ticket = await Ticket.create({
        total,
        status: "pendiente",
        customerName: customer.name,
        customerLastName: customer.lastName
    });

            const productsForTicket = validatedProducts.map(product => ({
            ticketID: ticket.id,
            productID: product.id,
            quantity: product.quantity,
            price: product.price,
            subtotal: product.quantity * product.price
        }));
        
        await Product_Ticket.bulkCreate(productsForTicket);

    // Ddescontar stock
    await productService.decreaseStock(validatedProducts);

    return ticket;

    
};

const calculateTotal = (products) => {

    let total = 0;

    for (const product of products) {
        total += product.price * product.quantity;
    }

    return total.toFixed(2);
};