import express from 'express';
const app = express();
app.disable('X-Powered-by');
const port = process.env.PORT || 3000;
import path from 'path';
import cors from 'cors';


import { router as brandsRouter } from './routes/brands.js';


import { connectDB } from "./db/sequelize.js";
connectDB();

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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
