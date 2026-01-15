import { Router } from "express";
import { register} from "../controllers/user.js";
import { validateBodySchema } from '../middlewares/validator.js'; // El middleware
import { registerUserSchema } from '../schemas/users.js'; // El esquema
//import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/users/register", validateBodySchema(registerUserSchema), register);



export { router };