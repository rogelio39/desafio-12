import { userModel } from "../models/users.models.js";
import logger from "../config/logger.js";

function esMayorDe144Horas(lastConnection) {
    if (!lastConnection) {
        return false; // O según tus necesidades
    }

    const ahora = new Date();
    const tiempoTranscurrido = ahora - new Date(lastConnection);
    const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60); // Convertir a horas

    return horasTranscurridas > 144;
}

// Función para eliminar la cuenta (ajusta esta lógica según tus necesidades)
async function eliminarCuenta(user) {
    await userModel.findByIdAndDelete(user._id);
    return console.log("usuario eliminado")
}

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name email last_connection');
        res.status(200).send({ respuesta: 'ok', mensaje: users });

    } catch (error) {
        logger.error(`error del servidor ${error}`)
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (user) {
            res.status(200).send({ respuesta: 'ok', mensaje: user });
        } else {
            logger.warning(`error 404: usuario no encontrado`)
            res.status(404).send({ respuesta: "error", mensaje: "user not found" });
        }
    } catch (error) {
        logger.error(`error del servidor ${error}`)
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}

export const postProfileImage = async (req, res) => {

    const id = req.params.id;
    const file = req.file;

    console.log("id", id)
    console.log("req", file)

    if (!file) {
        logger.warning(`No se subieron archivos`)
        return res.status(400).send('No se subieron archivos.');
    }

    try {
        const user = await userModel.findById(id);
        if (!user) {
            logger.warning(`Usuario no encontrado`)
            return res.status(404).send("Usuario no encontrado");
        }
        else {
            const updatedThumbnails = {
                name: file.filename,
                reference: file.path
            };

            if (!user.thumbnail) {
                user.thumbnail = [];
            }

            user.thumbnail = updatedThumbnails;
            await user.save();
            res.status(200).send("imagen subida con exito")
        }

    } catch (error) {
        logger.error(`error al subir imagenes ${error}`);
        res.status(500).send("error al subir imagenes")
    }
}

export const putUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;
    try {
        const respuesta = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password });
        if (respuesta) {
            res.status(200).send({ respuesta: 'ok', mensaje: respuesta });
        } else {
            logger.warning(`error, usuario no encontrado`)
            res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontrado' });
        }

    } catch (error) {
        logger.error(`error del servidor ${error}`)
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({ respuesta: 'ok', mensaje: 'usuario borrado' });
        } else {
            logger.warning(`error, usuario no encontrado, error al eliminar`)
            res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontrado, error al eliminar' });
        }


    } catch (error) {
        logger.error(`error del servidor ${error}`)
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}



export const deleteAllInactiveUser = async (req, res) => {
    try {
        const checkDeleteUsers = [];
        const users = await userModel.find({}, 'last_connection');
        for (const user of users) {
            if (esMayorDe144Horas(user.last_connection)) {
                checkDeleteUsers.push(user);
                await eliminarCuenta(user);
            }
        }
        if (checkDeleteUsers.length < 0) {
            logger.warning(`error al eliminar usuario`)
            res.status(400).send({ message: "error al eliminar usuario" })
        } else {
            res.status(200).send({ resultado: 'sesión y cuenta eliminadas debido a inactividad' });
            console.log("usuarios eliminados");
        }

    } catch (error) {
        logger.error(`error del servidor ${error}`)
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}

