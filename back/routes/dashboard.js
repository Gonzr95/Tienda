import { Router } from 'express';
const router = Router();

router.get('/backoffice', (req, res) => {
    res.json({ message: 'Acceso al panel de administración concedido.' });
});


export { router };