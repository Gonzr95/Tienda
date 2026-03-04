import express from 'express';
import session from 'express-session';
import cors from 'cors';
const app = express();
app.disable('X-Powered-by');
console.log("No te olvides de configurar las variables de entorno en el archivo .env");
console.log("Variables de entorno necesarias:");
console.log("DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT, SERVER_PORT, DEV_FRONTEND_URL1, DEV_FRONTEND_URL2, DEV_BACKEND_URL");

// ****** SESSION CONFIGURATION ******
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

// ****** BODY PARSER CONFIGURATION ******
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies   
app.use(express.json());

const serverPort = process.env.SERVER_PORT || 3000;
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./db/sequelize.js";
import { setupAssociations } from './models/associations.js';
import { setupRoutes } from './routes/routes.cofig.js';
 

setupAssociations();
connectDB();


// Convertimos la URL del módulo actual en una ruta de carpeta
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);


// ****** STATIC FILES CONFIGURATION ******
app.use(express.static(path.join(_dirname, 'public')));
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

// ****** CORS CONFIGURATION ******
app.use(cors({
    origin: [
        process.env.FRONTEND_URL1,
        process.env.FRONTEND_URL2,

    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
    //credentials: true, 
}));


// ****** VIEW ENGINE CONFIGURATION ******
app.set('view engine', 'ejs');
app.set('views', './views');


setupRoutes(app);
app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});
