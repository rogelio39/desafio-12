import multer from "multer";
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
            res.status(400).send({ message: "hubo un error al intentar cargar la imagen" })
        }
    } catch (error) {
        res.status(500).send({ error: error })
    }
}
