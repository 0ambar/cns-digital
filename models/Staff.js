import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";

// Modelo para usuario de la plataforma
const Staff = db.define('staff', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellidoPaterno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellidoMaterno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Si el trabajador es medico o enfermero
    tipo: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    
    // Estatus del trabajador, si esta activo o no
    estatus: DataTypes.BOOLEAN, 
}, 
    
    // Funcion para encriptar la contraseña del usuario
    {
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
        }}
    }
);

// Metodos personalizados
// Veriricar que el password del ususario este correcto
Staff.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Staff