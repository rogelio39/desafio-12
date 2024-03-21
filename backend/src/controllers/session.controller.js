import { generateToken } from "../utils/jwt.js";
import logger from "../config/logger.js";

// Función para calcular el tiempo transcurrido desde la última conexión
function calcularTiempoDesconectado(ultimaConexion) {
    // Verifica si la última conexión es válida
    if (!ultimaConexion) {
        return null; // o un valor por defecto, según tus necesidades
    }

    // Obtiene la fecha actual
    const ahora = new Date();

    // Calcula la diferencia en milisegundos
    const tiempoTranscurrido = ahora - new Date(ultimaConexion);

    // Convierte la diferencia a segundos
    const segundosTranscurridos = tiempoTranscurrido / 1000;

    // Puedes ajustar la lógica según tus necesidades para devolver el tiempo en el formato deseado
    return segundosTranscurridos;
}



export const login = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send({ message: 'invalid user' })
        }
        // //esto es por si seguimos con sessiones en db. Si usamos JWT se borra
        // req.session.user = {
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     age: req.user.age,
        //     email: req.user.email,
        // };
        // res.status(200).send({usuario: 'usuario logueado'})
        const lastConnection = req.user.last_connection;
        const tiempoDesconectado = calcularTiempoDesconectado(lastConnection);
        if (tiempoDesconectado !== null) {
            console.log(`El usuario ha estado desconectado durante ${tiempoDesconectado} segundos.`);
        } else {
            console.log("La última conexión no es válida.");
        }


        // Actualizar last_connection al iniciar sesión
        req.user.last_connection = Date.now();
        await req.user.save();
        //generamos el token
        const token = generateToken(req.user);
        // //enviamos el token por cookie
        res.cookie('jwtCookie', token, {
            maxAge: 4320000 //12 hs en mili segundos
        });
        // res.status(200).send({ payload: req.user });
        res.status(200).send({ token: token, cid: req.user.cart, user : req.user });
    } catch (error) {
        logger.error(`Error del servidor ${error}`);
        res.status(500).send({ message: `error al iniciar  sesion ${error}` });
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            res.status(400).send({ message: 'existing user' })
        } else {
            res.status(200).send({ mensaje: 'User created' });
        }
    } catch (error) {
        res.status(500).send({ message: `Error register ${error}` });
    }
}

export const github = async (req, res) => {
    res.status(200).send({ message: 'usuario registrado' });
}

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ message: 'usuario logueado' });
}

export const current = async (req, res) => {
    res.send({ "user": req.user });
}
export const logout = async (req, res) => {
    try {
        // si manejo sesiones en base de datos va esto
        if (req.session.user) {
            req.session.user.last_connection = Date.now();
            req.session.destroy();
        }
        else if (req.user) {
            // Actualizar last_connection al cerrar sesión
            req.user.last_connection = Date.now();
            await req.user.save();
        }
        // sino, va esto:
        res.clearCookie('jwtCookie');
        res.status(200).send({ resultado: 'usuario deslogueado' })
    } catch (error) {
        res.status(400).send({ error: `error en logout ${error}` });
    }
}



