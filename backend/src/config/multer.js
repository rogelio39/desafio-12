import multer from "multer";
import { __dirname } from "../path.js";
import path from 'path';


// config multer 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        let uploadPath = '';
        
        if(file.fieldname === 'profileImage'){
            uploadPath = path.join(__dirname, 'uploads/profiles');
        } else if(file.fieldname === 'productImage'){
            uploadPath = path.join(__dirname, 'uploads/products');
        } else if (fieldname === 'document'){
            uploadPath = path.join(__dirname, 'uploads/documents')
        }

        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`
        callback(null, fileName);
    }
});

export const upload = multer({ storage: storage });


