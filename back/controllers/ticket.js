import * as ticketService from "../services/ticketService.js";
import { Ticket } from "../models/ticket.js";
import { Product } from "../models/product.js";
import { Product_Ticket } from "../models/product_ticket.js";
import { User } from "../models/user.js";
import { Brand } from "../models/brand.js";

import PDFDOcument from "pdfkit";

export const createTicket = async (req, res) => {
    try {

        const { products, customerData } = req.body;


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
        const ticket = await ticketService.createTicket(products, customerData);
        

        return res.status(201).json({
            message: "Ticket creado correctamente",
            ticketId: ticket.dataValues.id,
            

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

export async function generateTicketPDF(req, res) {
    try {
        const { id } = req.params;

        // Buscar el ticket por ID
// 1. Buscamos el Ticket
        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'lineUp', 'price'], 
                    // IMPORTANTE: Aquí referenciamos el modelo intermedio tal cual lo importaste
                    through: {
                        model: Product_Ticket,
                        attributes: ['quantity', 'price'] 
                    },
                    include: [
                    {
                        model: Brand,
                        as: 'brand',
                        attributes: ['name']
                    }]
                }
            ]
        });
        if( !ticket ) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // Crear el documento PDF
        const doc = new PDFDOcument();
        const fileName = `ticket_${ticket.id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        //res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${fileName}"`
        );
        doc.pipe(res);


        // Encabezado
        doc.fontSize(20).text('Comprobante de Compra', { align: 'center' });
        doc.moveDown();

        // Datos del Ticket (Datos de la tabla Ticket)
        doc.fontSize(12).font('Helvetica-Bold').text(`Ticket N°: ${ticket.id}`);
        doc.font('Helvetica').text(`Fecha: ${new Date(ticket.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        // Datos del Cliente
        doc.text(`Cliente: ${ticket.customerName} ${ticket.customerLastName}`); // Usando tus nombres de columna
        doc.moveDown();

        // Línea separadora
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Encabezados de la tabla de productos
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Producto', 50, tableTop);
        doc.text('Cant.', 300, tableTop);
        doc.text('Precio Unit.', 370, tableTop);
        doc.text('Subtotal', 470, tableTop);
        doc.font('Helvetica');
        doc.moveDown();

        // Iterar sobre los productos encontrados
        let positionY = doc.y;

        ticket.Products.forEach(product => {
            // NOTA IMPORTANTE:
            // En Sequelize, los datos de la tabla intermedia (ProductTicket)
            // se guardan usualmente en una propiedad llamada igual que la tabla,
            // o simplemente 'ProductTicket'. 
            console.log("esto es el foreach de product: ", product);
            const quantity = product.Product_Ticket.quantity; 
            const price = Number(product.Product_Ticket.price); 
            const subtotal = quantity * Number(price);
            const productName = `${product.brand?.name || 'Sin marca'} ${product.lineUp}`;

            // Imprimir fila
            doc.text(productName, 50, positionY, { width: 240 });
            doc.text(quantity.toString(), 300, positionY);
            doc.text(`$${price.toFixed(2)}`, 370, positionY);
            doc.text(`$${subtotal.toFixed(2)}`, 470, positionY);
            
            positionY += 20; // Bajar 20px para la siguiente fila
        });

        // Línea separadora final
        doc.moveDown();
        doc.moveTo(50, positionY).lineTo(550, positionY).stroke();
        
        // Total (Este dato viene directo de la tabla Ticket)
        positionY += 15;
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text(`TOTAL A ABONAR: $${ticket.total}`, 300, positionY, { align: 'right' }); // Alineado a la derecha pero partiendo de 300

        // 5. Finalizar
        doc.end();


    } catch (error) {
        console.error("Error generando PDF del ticket:", error);
        return res.status(500).json({ message: "Error generando el PDF del ticket" });
    }
}