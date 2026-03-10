import * as ticketService from "../services/ticketService.js";
import { Ticket } from "../models/ticket.js";
import { Product } from "../models/product.js";
import { Product_Ticket } from "../models/product_ticket.js";
import { User } from "../models/user.js";
import { Brand } from "../models/brand.js"
import { Op } from "sequelize";

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
            //console.log("esto es el foreach de product: ", product);
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

export async function getTickets(req, res) {

    /*

    esta funcion debera conectarse a la base de datos y traer los tickets segun los filtros que se le pasen por query (fecha, cliente, etc) y paginar los resultados
    Los filtros necesarios son:
    - customerName
    - customerLastName
    - createdAt
    - status
    La paginacion se hara con los parametros page y limit, y el ordenamiento con sortBy (columna) y sortOrder (asc o desc)
    Adicionalmente se debera incluir en la respuesta los datos de los productos asociados a cada ticket, incluyendo:
    - name
    - brand (nombre de la marca, no el id)
    - lineUp
    - description
    - price (precio al momento de la compra, que se guarda en la tabla intermedia Product_Ticket)
    - quantity (cantidad comprada, que se guarda en la tabla intermedia Product_Ticket)
    Adicionalmente se debera incluir en la respuesta la metadata de la paginacion (totalItems, totalPages, currentPage, itemsPerPage) y los filtros aplicados (sortBy, sortOrder, customerName, customerLastName, createdAt, status)
    Contexto:
    - El modulo Product cuenta con los siguientes campos en su modelo: id, name, brandId (apunta a la tabla Brand, la cual tiene un campo llamado name), lineUp, description, price
    - el modelo Ticket tiene los siguientes campos: id, customerName, customerLastName, createdAt, status, total, comentario, status
    - la tabla intermedia Product_Ticket tiene los siguientes campos: productId, ticketId, quantity, price, subtotal
    */ 
   

  try {
    const {
      customerName,
      customerLastName,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC"
    } = req.query;

    // --------------------------------------------------
    // 1️⃣ Validaciones fuertes (anti SQL injection)
    // --------------------------------------------------

    const allowedSortFields = [
      "id",
      "customerName",
      "customerLastName",
      "createdAt",
      "status",
      "total"
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeSortOrder =
      sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const offset = (currentPage - 1) * itemsPerPage;

    // --------------------------------------------------
    // 2️⃣ Construcción dinámica de filtros
    // --------------------------------------------------

    const whereClause = {};

    if (customerName) {
      whereClause.customerName = {
        [Op.iLike]: `%${customerName}%`
      };
    }

    if (customerLastName) {
      whereClause.customerLastName = {
        [Op.iLike]: `%${customerLastName}%`
      };
    }

    if (status) {
      whereClause.status = status;
    }

    // 🔥 RANGO DE FECHAS
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};

      if (dateFrom) {
        whereClause.createdAt[Op.gte] = new Date(dateFrom + "T00:00:00");
      }

      if (dateTo) {
        whereClause.createdAt[Op.lte] = new Date(dateTo + "T23:59:59");
      }
    }

    // --------------------------------------------------
    // 3️⃣ Query principal optimizada
    // --------------------------------------------------

    const { count: totalItems, rows: tickets } =
      await Ticket.findAndCountAll({
        where: whereClause,
        limit: itemsPerPage,
        offset,
        distinct: true, // ⚠️ Fundamental en many-to-many
        order: [[safeSortBy, safeSortOrder]],
        include: [
          {
            model: Product,
            attributes: ["id", "name", "lineUp", "description"],
            include: [
              {
                model: Brand,
                as: "brand",
                attributes: ["name"]
              }
            ],
            through: {
              attributes: ["price", "quantity"]
            }
          }
        ]
      });

    const totalPages = Math.ceil(totalItems / itemsPerPage);


    // --------------------------------------------------
    // 4️⃣ Formateo limpio
    // --------------------------------------------------

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      customerName: ticket.customerName,
      customerLastName: ticket.customerLastName,
      createdAt: ticket.createdAt,
      status: ticket.status,
      total: ticket.total,
      comentario: ticket.comentario,
      products: ticket.Products.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand?.name || null,
        lineUp: product.lineUp,
        description: product.description,
        price: product.Product_Ticket.price,
        quantity: product.Product_Ticket.quantity
      }))
    }));

    // --------------------------------------------------
    // 5️⃣ Respuesta final limpia
    // --------------------------------------------------

    return res.status(200).json({
      tickets: formattedTickets,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        itemsPerPage
      },
      filters: {
        sortBy: safeSortBy,
        sortOrder: safeSortOrder,
        customerName: customerName || null,
        customerLastName: customerLastName || null,
        status: status || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      }
    });

  } catch (error) {
    console.error("Error en getTickets:", error);
    return res.status(500).json({
      message: "Error al obtener los tickets",
      error: error.message
    });
  }
};

/*
    mediante params se recibe el id del ticket a actualiizar y se modifican los campos enviados en el body, que pueden ser:
- customerName
- customerLastName
- status
- comentario
*/
export async function updateTicket(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Debe enviar el id del ticket en la URL"
      });
    }

    // --------------------------------------------------
    // 1️⃣ Buscar ticket
    // --------------------------------------------------

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    // --------------------------------------------------
    // 2️⃣ Campos permitidos
    // --------------------------------------------------

    const allowedFields = [
      "customerName",
      "customerLastName",
      "status",
      "comentario"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // --------------------------------------------------
    // 3️⃣ Validación de status ENUM
    // --------------------------------------------------

    const allowedStatus = [
        "pendiente",
        "en revision",
        "aguardando pago",
        "confirmada",
        "cancelada",
        "finalizada exitosamente"
    ];

    if (
      updates.status &&
      !allowedStatus.includes(updates.status)
    ) {
      return res.status(400).json({
        message: "Estado inválido"
      });
    }

    // --------------------------------------------------
    // 4️⃣ Actualizar
    // --------------------------------------------------

    await ticket.update(updates);

    return res.status(200).json({
      message: "Ticket actualizado correctamente",
      ticket
    });

  } catch (error) {
    console.error("Error en updateTicket:", error);
    return res.status(500).json({
      message: "Error al actualizar el ticket",
      error: error.message
    });
  }
}