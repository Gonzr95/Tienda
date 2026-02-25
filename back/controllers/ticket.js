import * as ticketService from "../services/ticketService.js";

export const createTicket = async (req, res) => {
    try {

        const { products } = req.body;

        if (!products) {
            return res.status(400).json({
                message: "Products array is required"
            });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Products must be a non-empty array"
            });
        }

        //logica de creacion de ticket segun mi negocio
        const ticket = await ticketService.createTicket(products);
        return res.status(201).json({
            message: "Ticket creado correctamente",
            ticket
        });

    } catch (error) {

        // 4️⃣ Manejo de errores controlados
        if (error.name === "ProductNotFoundError") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.name === "InsufficientStockError") {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        // 5️⃣ Error inesperado
        console.error("Unexpected error creating ticket:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};