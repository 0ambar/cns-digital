import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS ?? '', {
    host: process.env.DB_HOST,
    port: '3306',
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        // Maximo de conexiones por persona
        max: 5, 
        // Minimo de conexiones por persona
        min: 0,
        // tiempo para intentar establecer conexion antes de obtener conexion
        acquire: 30000,
        // tiempo para finalizar conexion 
        idle: 10000
    },
    // Funcion obsoleta
    operatorsAliases: false
});

export default db;