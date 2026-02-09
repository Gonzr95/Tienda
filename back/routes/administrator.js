import { Router } from "express";
const router = Router();
import { validate } from "../middlewares/validator.js";
import { createAdminSchema, loginAdminSchema} from "../schemas/administrator.js";
import { createAdmin, loginAdmin, loginAdminSSR } from "../controllers/administrator.js";
import { authenticate } from "../middlewares/auth.js";



router.post("/administrator/register", validate.body(createAdminSchema), createAdmin);

router.post('/administrator/login', validate.body(loginAdminSchema), loginAdminSSR);

/*
router.delete('/logout', authenticate, logout, (req, res) => {
    res.json({ message: "Logout successful" });
});*/

// Ruta PROTEGIDA: Perfil
router.get('/me', authenticate, (req, res) => {
    // req.user viene del middleware authenticate
    res.json({ 
        message: "¡Estás en una ruta protegida!", 
        admin: req.admin
    });
});

export { router };