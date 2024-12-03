
const formularioRegistro = (req, res) => {
    // el primer argumento es la vista a renderizar y el segundo un objeto con la informacion que quieres pasar
     res.render('auth/registro', {
         pagina: 'Crear Cuenta'
    })
}


// export nombrado
export {
    formularioRegistro
}