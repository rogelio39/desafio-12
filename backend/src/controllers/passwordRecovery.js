import { sendRecoveryMail } from "./nodemailer.controller.js";
import { generateToken } from "../utils/jwt.js";
import { userModel } from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import logger from "../config/logger.js";

const recoveryLinks = {};
let userEmail;

export const passwordRecovery = async (req, res) => {
    //enviar mail
    const { email } = req.body;
    userEmail = email;
    try {
        if (email) {
            const token = generateToken(email);
            recoveryLinks[token] = { email: email, timestamp: Date.now() };

            const recoveryLink = `http://localhost:4000/api/password/reset/${token}`;

            sendRecoveryMail(email, recoveryLink);

            res.status(200).send(`Correo de recuperacion enviado`);
        } else {
            logger.error(`EMAIL INVALIDO, ${email}`)
            res.status(400).send("debes ingresar un email valido");
        }

    } catch (error) {
        logger.error(`error del servidor al enviar email ${error}`)
        res.status(500).send(`error al enviar el mail ${error}`);
    }

}

export const resetPassword = async (req, res) => {

    //recuperar la contraseña
    const { token } = req.params;
    const { newPassword, newPassword2 } = req.body;

    try {
        //REFACTORIZAR LAS ANIDACIONES
        const linkData = recoveryLinks[token];
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            //modificar usuario con nueva contraseña
            if (newPassword == newPassword2) {
                delete recoveryLinks[token];
                const user = await userModel.findOne({ email: userEmail }).lean();
                const passwordHash = createHash(newPassword);
                if (user) {
                    const update = await userModel.findByIdAndUpdate(user._id, { password: passwordHash });
                    if (update != null) {
                        res.status(200).send("Contraseña modificada correctamente");
                    } else {
                        logger.warning(`error al intentar actualizar password`)
                        res.status(400).send("error al tratar de actualizar password");
                    }
                } else {
                    logger.warning(`error: El email no coincide con ningun usuario`)
                    res.status(400).send("el email no coincide con ningun usuario");
                }
            } else {
                logger.error(`Las contraseñas deben ser identicas`)
                res.status(400).send("Las contraseñas deben ser identicas");
            }
        } else {
            logger.error(`error: token invalido o expirado`)
            res.status(400).send("token invalido o expirado. Pruebe nuevamente");
        }

    } catch (error) {
        logger.error(`error del servidor al modificar contraseña ${error}`)
        res.status(500).send(`Error al modificar contraseña ${error}`);
    }




}


