import { Router } from "express";
import { register} from "../controllers/user.js";
import { validate } from '../middlewares/validator.js';
import { registerUserSchema, loginUserSchema } from '../schemas/users.js';
import { login } from "../controllers/user.js";
//import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/users/register", validate.body(registerUserSchema), register);
router.post('/users/login', validate.body(loginUserSchema), login);



export { router };