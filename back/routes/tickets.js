import { Router } from "express";
const router = Router();
import { validate } from "../middlewares/validator.js";
/*
import { createSchema, getTicketsQuerySchema } from "../schemas/tickets.js";
import { createTicket, getTickets } from "../controllers/ticket.js";*/

router.post('/tickets', (req, res) => {
    // Aquí iría la lógica para crear un ticket
    res.status(201).json({ message: 'Post a Tickets' });
});

export { router };