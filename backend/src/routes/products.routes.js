import { Router } from "express";
import {getProducts ,getProductById, postProduct, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
import { upload } from "../config/multer.js";
import { uploadProductImages} from "../controllers/products.controller.js";

const productRouter = Router();


productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById);
productRouter.post('/', passportError('jwt'), authorization('admin'), postProduct);
productRouter.put('/:id', passportError('jwt'), authorization('user'), putProduct);
productRouter.post('/:id/images', upload.array('productImage', 6), uploadProductImages);
productRouter.delete('/:id', passportError('jwt'), authorization('user'), deleteProduct);


export default productRouter;