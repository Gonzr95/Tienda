import { Router } from "express";
import { register} from "../controllers/user.js";
import { validateBodySchema } from '../middlewares/validator.js'; // El middleware
import { registerUserSchema, loginUserSchema } from '../schemas/users.js'; // El esquema
import { login } from "../controllers/user.js";
//import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/users/register", validateBodySchema(registerUserSchema), register);
router.post('/users/login', validateBodySchema(loginUserSchema), login);



export { router };