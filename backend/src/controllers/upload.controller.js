import multer from "multer";
import logger from '../config/logger.js'

// config multer 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/img');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()} ${file.originalname}`)
    }
});

export const upload = multer({ storage: storage });

export const uploadSingle = async (req, res) => {
    try {
        const imageUpload = req.file;
        console.log("imagen", imageUpload);
        if (imageUpload) {
            res.status(200).send('imagen cargada');
        } else {
            logger.warning('hubo un error al intentar cargar la imagen')
            res.status(400).send({ message: "hubo un error al intentar cargar la imagen" })
        }
    } catch (error) {
        logger.error(`Error del servidor ${error}`)
        res.status(500).send({ error: error })
    }
}
