import { Router } from 'express';
const router = Router();

router.get('/backoffice', (req, res) => {
    res.render('../views/login');
});


router.post('/backoffice/login', (req, res) => {
    //res.render('../views/login');
});


export { router };