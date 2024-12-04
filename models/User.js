import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";

// Modelo para usuario de la plataforma
const Usuario = db.define('usuario', {
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
        type: DataTypes.STRING
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    curp: {
        type: DataTypes.STRING(18),
        allowNull: false
    },

    tipoSangre: {
        type: DataTypes.STRING(3)
    },

    domicilio: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },

    genero: {
        type: DataTypes.STRING(1),
        allowNull: false
    },

    // Municipio o alcaldia de nacimiento
    lugarNacimiento: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Si la cuenta del usuario esta activa o no
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
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuario