import { User } from '../models/user.js'; 
import { hashPassword, comparePassword} from '../utils/bcrypt.js'; 
import { generateToken } from '../utils/jwt.js';
import { BlacklistedToken } from '../models/blacklistedToken.js';

export async function register(userData) {
    const { firstName, lastName, mail, pass } = userData;

    // 1. Lógica de negocio: Hashear password
    const hashedPass = await hashPassword(pass);

    // 2. Persistencia: Crear usuario
    // El error de Sequelize se lanzará aquí y subirá al controller
    const newUser = await User.create({
        firstName,
        lastName,
        mail,
        pass: hashedPass
    });

    // 3. Retornar solo lo necesario (buena práctica: no devolver el pass)
    // Sequelize suele devolver el objeto completo en .dataValues o similar
    const userResponse = newUser.toJSON();
    delete userResponse.pass; 
    
    return userResponse;
}