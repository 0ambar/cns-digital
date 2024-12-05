import entidades from "./entidades.js";
import db from "../config/db.js";
import { EntidadFederativa } from "../models/index.js"

// Funcion para importar datos del seeder e insertarlos en las tablas 'precios' y 'categorias'
const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate();
        
        // Generar columnas
        await db.sync();

        // Insertamos en la base de datos con promise porque son procesos independientes
        await Promise.all([
            EntidadFederativa.bulkCreate(entidades), // Insertar estados de la republica
        ]);

        console.log('Datos importados correctamente');
        exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Funcion para eliminar datos en las tablas 'precios' y 'categorias'
const eliminarDatos = async () => {
    try {
        // Con promise porque son procesos independientes
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}), 
        //     Precio.destroy({where: {}, truncate: true}) 
        // ]);

        await db.sync({force: true});
    
        console.log('Datos eliminados correctamente');
        exit(0);
    
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    
}


// Funcion que manda a llamar 'importarDatos' cuando se ejecute el comando 'db:importar' en la terminal
// Process es interno de JS. argv es un comando de node para los argumentos en instrucciones del cli
if(process.argv[2] === '-i') {
    importarDatos();
}

// Funcion que manda a llamar 'eliminarDatos' cuando se ejecute el comando 'db:eliminar' en la termial
if(process.argv[2] === '-e') {
    eliminarDatos();
}