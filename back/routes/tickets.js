import { Router } from "express";
const router = Router();
import { validate } from "../middlewares/validator.js";
import { createTicket, generateTicketPDF, getTickets, updateTicket } from "../controllers/ticket.js";
/*
import { createSchema, getTicketsQuerySchema } from "../schemas/tickets.js";
import { createTicket, getTickets } from "../controllers/ticket.js";*/

router.post('/tickets', createTicket);
router.get("/tickets", getTickets);
router.put("/tickets/:id", updateTicket); // 
router.get("/tickets/:id/pdf", generateTicketPDF);


export { router };