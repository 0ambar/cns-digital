import express from 'express'; 
import userRoutes from "./routes/userRoutes.js"

// Crear la app, contiene toda la informacion del servidor de express (instancia de express)
const app = express()


// Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))


// Habilitar PUG
app.set('view engine', 'pug')
// Carpeta donde se encuentran archivos pug (carpeta views)
app.set('views', './views')


// Carpeta de recursos estaticos 
app.use(express.static('public'))


// Routing
app.use('/auth', userRoutes)

// Definir el puerto y arrancarlo
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});