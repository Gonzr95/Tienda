import { Router } from "express";
import { authenticate, authenticateSession } from "../middlewares/auth.js";
const router = Router();

router.get('/backoffice', (req, res) => {
    const dashboardData = {
        dataToShow: "¡Bienvenido al Backoffice! Aquí puedes gestionar tu tienda."
    };

    // 'backoffice' nombrede archivo ejs
    // objeto que lee la vista
    res.render('backoffice', dashboardData);
});


router.get('/backoffice/home', authenticateSession, (req, res) => {
    /*
    res.json({ 
        message: "¡Estás en una ruta protegida!", 
        admin: req.admin
    });*/
    // esto rompe porque envia 2 respuestas: la del json y la del render.

    // 'backoffice' nombrede archivo ejs
    // esto es lo que tenemos que ajustar
    res.render('home', { admin: req.admin });
});


export { router };