import express from 'express';
import session from 'express-session';
import expressListRoutes from 'express-list-routes';

//import cors from 'cors';

const app = express();
app.disable('X-Powered-by');
console.log(`------VARIABLES DE ENTORNO------
   - DB_USER 
   - DB_PASS
   - DB_NAME
   - DB_HOST
   - DB_PORT
   - SERVER_PORT
   - DEV_FRONTEND_URL1
   - DEV_FRONTEND_URL2
   - DEV_BACKEND_URL
   - COOKIE_SECRET
   - PROD_FRONTEND_URL
   `);
console.log(`------NGINX------
  - Sacar la carpeta estatica si lo vas a servir desde Nginx.
  - Set trust proxy con el uso de Nginx.
  - Set secure: true en la cookie de sesión y usar HTTPS
  - Establecer el secreto de la cookie
  - Comentar CORS config
  - Servir Public y Uploads desde Nginx.
  - La ruta de las imagenes el backoffice cuando es servido desde nginx Cambia a https://gonzadev.tplinkdns.com/ + ruta de imagen en la base de datos
  `);
console.log(`------Extra------
    - cambiar variable de entorno de prod a dev en index.html para redireccionar al backoffice
    - inventory: loadCategories tiene variable de entorno
    - Inventory loadProducts tiene variable de entorno
    - Inventory and checkout vas a tener que cambiar el path de a imagen por la variable de entorno baseUrl
    - Variable de entorno de checkout 2
    - Revisar la direccion del api/administrator/login. la ultma vez no tuve que tocar nada 
    - Revisar la creacion de imagenes en el frontend, se cambia la direccion a https://gonzadev.tplinkdns.com/ + ruta de imagen en la base de datos
    - 
  `);


// ****** SESSION CONFIGURATION ******
app.set('trust proxy', 1);  // Si usas nginx, habilita esto para que las cookies funcionen correctamente en producción
app.use(session({
  name: 'admin.sid',        // Nombre de la cookie de sesión que vivira en navegador/application/cookies
  secret: process.env.COOKIE_SECRET || 'developmenet', // Cambia esto por una clave secreta fuerte en producción
  resave: false,            // No volver a guardar la sesion si no ha habido cambios
  saveUninitialized: false, // No guardar una sesion vacia, solo se guardara si se le asigna un valor a req.session
  proxy: true,              // En Nginx esta opcion tiene que estar presente y seteada true
  cookie: {
    httpOnly: true,         // la cookie no es accesible desde JavaScript del lado del cliente, lo que ayuda a prevenir ataques XSS
    secure: true,           // False en local *** true en nginx
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
//app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

// ****** CORS CONFIGURATION ******
// Solo necesaria en desarrollo ya que con nginx todo vivira en el mismo dominio.
// app.use(cors({
//     origin: [
//         process.env.DEV_FRONTEND_URL1,
//         process.env.DEV_FRONTEND_URL2,
//         //process.env.PROD_FRONTEND_URL
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));


// ****** VIEW ENGINE CONFIGURATION ******
app.set('view engine', 'ejs');
app.set('views', './views');

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.originalUrl}`);
    next();
});
setupRoutes(app);
console.log('Registered routes:', expressListRoutes(app));
app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});
