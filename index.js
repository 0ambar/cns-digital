import express from 'express'; 
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import db from "./config/db.js";

// Crear la app, contiene toda la informacion del servidor de express (instancia de express)
const app = express();

// Conexion a la BD
try {
    await db.authenticate();
    db.sync() // ayuda para sincronizar BD con el modelo
    console.log('Conexion correcta a la base de datos')
} catch (error) {
    console.log(error)
}


// Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));


// Habilitar PUG
app.set('view engine', 'pug');
// Carpeta donde se encuentran archivos pug (carpeta views)
app.set('views', './views');


// Carpeta de recursos estaticos 
app.use(express.static('public'));


// Routing
app.use('/auth/pacientes', userRoutes);
app.use('/auth/personal', staffRoutes);
app.use('/', adminRoutes);


// Definir el puerto y arrancarlo
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});