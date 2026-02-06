import { Administrator } from '../models/administrator.js'; 
import { hashPassword, comparePassword} from '../utils/bcrypt.js'; 
import { generateToken } from '../utils/jwt.js';
//import { BlacklistedToken } from '../models/blacklistedToken.js';

export async function register(adminData) {
    const { firstName, lastName, mail, pass } = adminData;

    const hashedPass = await hashPassword(pass);

    // El error de Sequelize se lanzará aquí y subirá al controller
    const newAdmin = await Administrator.create({
        firstName,
        lastName,
        mail,
        pass: hashedPass
    });

    // 3. Retornar solo lo necesario (buena práctica: no devolver el pass)
    // Sequelize suele devolver el objeto completo en .dataValues o similar
    const adminResponse = newAdmin.toJSON();
    delete adminResponse.pass; 
    
    return adminResponse;
}

export async function loginAdmin({ mail, pass }) {
    // 1. Buscar usuario por email
    const admin = await Administrator.findOne({ where: { mail } });

    if (!admin) {
        // Por seguridad, es mejor decir "Credenciales inválidas" que "Usuario no existe"
        // pero para aprender, aquí sabremos que falló el usuario.
        throw new Error("ADMIN_NOT_FOUND"); 
    }

    // 2. Comparar contraseñas
    const isPasswordValid = await comparePassword(pass, admin.pass)
    if (!isPasswordValid) {
        throw new Error("WRONG_PASSWORD");
    }

    // 3. Generar Token
    // Guardamos en el token datos útiles (id, email, rol) pero NUNCA la password
    const token = generateToken({ id: admin.id, mail: admin.mail });

    // 4. Retornar info del usuario (sin pass) y el token
    const adminData = admin.toJSON();
    delete adminData.pass;
    delete adminData.createdAt;
    delete adminData.updatedAt;
    delete adminData.id;
    return { token, admin: adminData };
}