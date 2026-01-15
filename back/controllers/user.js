import * as userService from "../services/userService.js";
import { UniqueConstraintError } from 'sequelize';

export async function register(req, res) {
    try {
        console.log("Register controller called with data:", req.body);
        const result = await userService.register(req.body);
        return res.status(201).json(result);
        
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "El email ya existe" });
        }
        // Manejo genérico
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
};