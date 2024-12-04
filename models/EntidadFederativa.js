import { DataTypes } from "sequelize";
import db from "../config/db.js";

const EntidadFederativa = db.define('entidadFederativa', {
    entidad: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
 
export default EntidadFederativa 