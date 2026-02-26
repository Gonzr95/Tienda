import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerName: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },

    customerLastName: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true, //despues te cambiamos
    },
    total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            "pendiente",
            "en revision",
            "aguardando pago",
            "confirmada",
            "cancelada",
            "finalizada exitosamente"
        ),
        allowNull: false,
        defaultValue: "en revision"
    },
    comentario: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
},{ 
        timestamps: true,
        tableName: 'tickets',
        indexes: [
            {
                fields: ['status']
            }
        ]
    }
);