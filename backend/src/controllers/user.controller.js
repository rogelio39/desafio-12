import { productModel } from "../models/products.models.js";
import { userModel } from "../models/users.models.js";


export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name, email');
        res.status(200).send({ respuesta: 'ok', mensaje: users });

    } catch (error) {
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
            res.status(404).send({ respuesta: "error", mensaje: "user not found" });
        }
    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}

export const postProfileImage = async (req, res) => {

    const id = req.params.id;
    const file = req.file;

    console.log("id", id)
    console.log("req", file)

    if (!file) {
        return res.status(400).send('No se subieron archivos.');
    }

    try {
        const user = await userModel.findById(id);
        if (!user) {
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
        console.error("error al subir imagenes: ", error);
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
            res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontrado' });
        }

    } catch (error) {
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
            res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontado, error al eliminar' });
        }


    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}







