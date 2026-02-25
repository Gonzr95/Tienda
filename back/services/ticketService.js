import { Ticket } from "../models/ticket.js";
import * as productService from "./productService.js";

// valida stock
// calcula total
// crea ticket
// decrementa el stock
export const createTicket = async (products) => {

    // Validar productos y stock
    const validatedProducts = await productService.validateProductsAndStock(products);

    // Calcular total
    const total = calculateTotal(validatedProducts);

    // Crear ticket
    const ticket = await Ticket.create({
        total,
        status: "pendiente"
    });

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