import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { uploadSingle, upload } from "../controllers/upload.controller.js";

const uploadRouter = Router();





//este es el endpoint en el que me voy a conectar a mi aplicacion
uploadRouter.post('/upload', passportError('jwt'), authorization('admin'), upload.single('product'),uploadSingle);

export default uploadRouter;