import transporter from "../config/nodemailer.js";
import logger from "../config/logger.js";


export const nodemailerSend = async (req, res) => {
    let resultado;

    try {
        resultado = await transporter.sendMail({
            from: "TEST MAIL rogeliosuleta@gmail.com",
            to: "andresrogesu@gmail.com",
            subject: "Hola, buenas tardes",
            html:
                `
            <div>
                <h1>Buenas tardes</h1>
            </div>
    `
        })

        if (resultado) {

            console.log(resultado);
            res.status(200).send({ succes: "mail enviado con exito" });
        }
    } catch (error) {
        logger.error(`error: ${error}`);
        res.status(500).send({ error: "error al enviar mail" });
    }
}



export const sendRecoveryMail = (email, recoveryLink) => {

    if (email) {
        const mailOptions = {
            from: 'rogeliosuleta@gmail.com',
            to: email,
            subject: 'Link para restablecer su password',
            text: `Haga click en el siguiente enlace para reestablecer su password: ${recoveryLink}`
        }


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(`error del servidor  ${error}`);
            } else {
                logger.info(`Email enviado correctamente a ${email}`);
            }
        })
    } else {
        logger.error(`Debes ingresar un email`)
    }


}




export const finishBuy = (email, datas) => {

    if (email) {
        const mailOptions = {
            from: 'rogeliosuleta@gmail.com',
            to: email,
            subject: `Te enviamos los datos de tu compra  ${datas}`,
        }


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(`error al enviar mail ${error}`)
                console.error(error);
            } else {
                logger.info('el mail se envio correctamente al mail', email)
                console.log("Mail enviado correctamente");
            }
        })
    } else {
        logger.info('no hay una direccion de email')
        console.log("debes ingresar una direccion de correo electronico");
    }


}
