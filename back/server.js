import express from 'express';
import session from 'express-session';
import cors from 'cors';

const app = express();
app.disable('X-Powered-by');
console.log("No te olvides de configurar las variables de entorno en el archivo .env");
console.log("Variables de entorno necesarias:");
console.log("DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT, SERVER_PORT, DEV_FRONTEND_URL1, DEV_FRONTEND_URL2, DEV_BACKEND_URL");
console.log("Podes sacar la carpeta estatica si lo vas a servir desde nginx");
console.log("recorda descomentar trust proxy para el uso de nginx");
console.log("recorda establecer el secreto de la cookie ");
console.log("En producción, asegurate de configurar secure: true en la cookie de sesión y usar HTTPS");


// ****** SESSION CONFIGURATION ******
//app.set('trust proxy', 1); // Si usas nginx, habilita esto para que las cookies funcionen correctamente en producción

app.use(session({
  name: 'admin.sid', //nombre de la cookie de sesión que vivira en navegador/application/cookies
  secret: process.env.COOKIE_SECRET || 'developmenet', // Cambia esto por una clave secreta fuerte en producción
  resave: false, //no volver a guardar la sesion si no ha habido cambios
  saveUninitialized: false, //no guardar una sesion vacia, solo se guardara si se le asigna un valor a req.session
  cookie: {
    httpOnly: true, //la cookie no es accesible desde JavaScript del lado del cliente, lo que ayuda a prevenir ataques XSS
    secure: false,      // false en local *** true en nginx
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
// Solo necesaria en desarrollo ya que con nginx todo vivira en el mismo dominio.
app.use(cors({
    origin: [
        process.env.DEV_FRONTEND_URL1,
        process.env.DEV_FRONTEND_URL2,
        //process.env.PROD_FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


// ****** VIEW ENGINE CONFIGURATION ******
app.set('view engine', 'ejs');
app.set('views', './views');


setupRoutes(app);
app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});
