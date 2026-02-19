import express from 'express';
import session from 'express-session';




const app = express();
app.use(session({
  name: 'admin.sid',
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // 🔴 false en local
    sameSite: 'lax'
  }
}));




app.disable('X-Powered-by');
const port = process.env.PORT || 3000;
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import { connectDB } from "./db/sequelize.js";
import { setupAssociations } from './models/associations.js';

import { router as brandsRouter } from './routes/brands.js';
import { router as productsRouter } from './routes/products.js';
import { router as usersRouter } from './routes/users.js';
import { router as backofficeRouter } from './routes/backoffice.js';
import { router as administratorRouter } from './routes/administrator.js';

connectDB();
setupAssociations();
// --- CONFIGURACIÓN PARA ESM ---
// Convertimos la URL del módulo actual en una ruta de carpeta
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

app.use(express.static(path.join(_dirname, 'public')));
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));
//app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies   
app.use(express.json());


app.use(cors({
    origin: [
        //frontend URLS
        process.env.FRONTEND_URL1, //localhost
        process.env.FRONTEND_URL2  //ip

    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
    //credentials: true,
}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/api', brandsRouter);
app.use('/api', productsRouter);
app.use('/api', usersRouter);
app.use('/api', administratorRouter);
app.use('/', backofficeRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
