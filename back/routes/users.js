import { Router } from "express";
import { register, login, logout} from "../controllers/user.js";
import { validateSchema } from '../middlewares/validator.js'; // El middleware
import { registerUserSchema, loginUserSchema } from '../schemas/user.js'; // El esquema
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateSchema(registerUserSchema), register);