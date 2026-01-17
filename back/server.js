import express from 'express';
const app = express();
app.disable('X-Powered-by');
const port = process.env.PORT || 3000;
import path from 'path';
import cors from 'cors';

import { connectDB } from "./db/sequelize.js";
import { setupAssociations } from './models/associations.js';

import { router as brandsRouter } from './routes/brands.js';
import { router as productsRouter } from './routes/products.js';
import { router as usersRouter } from './routes/users.js';
import { router as dashboardRouter } from './routes/dashboard.js';


connectDB();
setupAssociations();
app.use('/public', express.static('public'));

//app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors({
    origin: [
        //frontend URLS
        process.env.FRONTEND_URL1, //localhost
        process.env.FRONTEND_URL2  //ip

    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
    //credentials: true,
}));
app.use(express.json());

//app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use('/api', brandsRouter);
app.use('/api', productsRouter);
app.use('/api', usersRouter);
app.use('/api', dashboardRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
