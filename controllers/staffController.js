import { check, validationResult } from 'express-validator';
import { Staff } from "../models/index.js";

const formularioRegistro = (req, res) => {
    // el primer argumento es la vista a renderizar y el segundo un objeto con la informacion que quieres pasar
     res.render('auth/registroPersonal', {
         pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {

    // leer los datos del body
    const { nombre, apellidoPaterno, apellidoMaterno, email, password, tipo } = req.body;

    await check('apellidoPaterno').trim().notEmpty().withMessage('El apellido paterno es obligatorio').run(req);
    await check('apellidoMaterno').trim().notEmpty().withMessage('El apellido materno es obligatorio').run(req);
    await check('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Formato de email invalido, no parece ser un email').run(req);
    await check('password').isLength({ min: 12 }).withMessage('La contraseña debe tener al menos 12 caracteres').run(req);
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(req);
    await check('tipo').trim().notEmpty().withMessage('El tipo de usuario es obligatorio').run(req);

    let errors = validationResult(req);

    // Renderizar vista con errores
    if (!errors.isEmpty()) {
        return res.render('auth/registroPersonal', {
            pagina: 'Crear Cuenta',
            errors: errors.array(),
            usuario: {
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                email,
                tipo
            }
        });
    }

    const existeUsuario = await Staff.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registroPersonal', {
            pagina: 'Crear cuenta',
            errors: [{msg: 'El usuario ya existe'}],
            usuario: {
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                email,
                tipo
            }
        })
    } 
    
    // Almacenar un usuario
    const usuario = await Staff.create({
        nombre, 
        apellidoPaterno, 
        apellidoMaterno, 
        email, 
        password, 
        tipo: tipo[0].toUpperCase()
    })

    // el primer argumento es la vista a renderizar y el segundo un objeto con la informacion que quieres pasar
     res.render('auth/registroPersonal', {
        pagina: 'Cuenta creada correctamente',
        mensaje: `${usuario.nombre}, tu cuenta fue creada correctamente`
    })
}


// export nombrado
export {
    formularioRegistro,
    registrar
}