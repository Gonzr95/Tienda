import { Router } from "express";
import { register} from "../controllers/user.js";
import { validateBodySchema } from '../middlewares/validator.js'; // El middleware
import { registerUserSchema, loginUserSchema } from '../schemas/users.js'; // El esquema
//import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/users/register", validateBodySchema(registerUserSchema), register);
router.post('/login', validateSchema(loginUserSchema), login);



export { router };