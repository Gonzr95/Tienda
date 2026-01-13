import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Brand = sequelize.define("Brand", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true, //created updated
    tableName: 'brands'
});