import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { Staff } from "../models/index.js";
import { generarId } from '../helpers/token.js';

// Formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

// Autenticacion de inicio de sesion
const autenticar = async (req, res) => {
    // leer los datos del body
    const { email, password } = req.body;

    await check('email').isEmail().withMessage('Email invalido').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let errors = validationResult(req);

    // Renderizar vista con errores
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errors: errors.array(),
            // Pasar el email para que no se borre al recargar la pagina
            email: email
        });
    }
    
    // Revisar si el usuario esta registrado
    const usuario = await Staff.findOne({ where: { email } });
    
    // Si el usuario no existe, renderiza vista con errores
    if (!usuario || !usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errors: [{msg: 'Uusario o contraseña incorrectos'}],
            // Pasar el email para que no se borre al recargar la pagina
            email: email
        })
    }

    // Crear una sesion
    // req.session.usuario = usuario;

    // // Redireccionar
    // res.redirect('/');
}


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

// Formulario para reestablecer contraseña
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvidePassword', {
        pagina: 'Recuperar el acceso a CNS'
    });
}

// Funcion para reestablecer contraseña
const resetPassword = async (req, res) => {

    // Validar el email
    await check('email').isEmail().withMessage('Email invalido').run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('auth/olvidePassword', {
            pagina: 'Recuperar el acceso a CNS',
            errors: errors.array()
        });
    }

    // Buscar el usuario
    const {email} = req.body;

    const usuario = await Staff.findOne({where: {email}});
    if (!usuario) {
        return res.render('auth/olvidePassword', {
            pagina: 'Recuperar el acceso a CNS',
            mensaje: 'No existe una cuenta con ese email',
            errors: [{msg: 'No existe una cuenta con ese email'}],
            error: true
        });
    }

    // Generar token
    usuario.token = generarId();
    await usuario.save();

    // Renderizar vista con mensaje de exito
    res.render('auth/olvidePassword', {
        pagina: 'Recuperar el acceso a CNS',
        mensaje: 'Hemos solicitado un cambio de contraseña',
    });
}

// Comprobacion de token para reestablecer contraseña
const comprobarToken = async (req, res) => {
    const {token} = req.params;

    // Buscar el usuario con el token
    const usuario = await Staff.findOne({where: {token}});

    // Si no se encuentra el usuario
    if (!usuario) {
        return res.render('auth/nuevoPassword', {
            pagina: 'Reestablece tu contraseña',
            mensaje: 'Hubo un error, vuelve a solicitar el cambio de contraseña',
            error: true
        });
    }

    // Renderizar vista para reestablecer contraseña
    res.render('auth/nuevoPassword', {
        pagina: 'Reestablece tu contraseña'
    });
}

const nuevoPassword = async (req, res) => {
    // Validar el passsword
    const { password } = req.body;
    await check('password').isLength({ min: 12 }).withMessage('La contraseña debe tener al menos 12 caracteres').run(req);
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(req);

    let errors = validationResult(req);

    // Renderizar vista con errores
    if (!errors.isEmpty()) {
        return res.render('auth/nuevoPassword', {
            pagina: 'Reestablece tu contraseña',
            errors: errors.array()
        });
    }

    // Identificar quien hace el cambio
    const {token} = req.params;
    const usuario = await Staff.findOne({where: {token}});

    // Hash del password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Limpiar token actual del usuario
    usuario.token = null;
    await usuario.save();

    // TODO: Enviar token

    // Renderizar vista con confirmacion de cambio
    res.render('auth/login', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'Tu contraseña se ha modificado correctamente'
    });
}


// export nombrado
export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}