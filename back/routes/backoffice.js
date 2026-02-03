import { Router } from "express";
const router = Router();

router.get('/backoffice', (req, res) => {
    const dashboardData = {
        usuario: 'Administrador',
        stats: {
            ventas: 150,
            usuariosNuevos: 45
        },
        fecha: new Date().toLocaleDateString()
    };

    // 'backoffice' nombrede archivo ejs
    // objeto que lee la vista
    res.render('backoffice', dashboardData);
});


export { router };