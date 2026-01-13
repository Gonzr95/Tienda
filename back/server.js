import express from 'express';
const app = express();
app.disable('X-Powered-by');
const port = process.env.PORT || 3000;
import path from 'path';
import cors from 'cors';
//Routers


import { connectDB } from "./db/sequelize.js";
connectDB();

app.use(cors({
    origin: [
        //frontend URLS
    process.env.FRONTEND_URL1,
    process.env.FRONTEND_URL2
        //localhost
        //ip
    ],
    // investigar esto
    methods: ["GET", "POST", "PUT", "DELETE"]
    //credentials: true,
}));
app.use(express.json());

