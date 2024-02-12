import { Router } from "express";
import { getUser, getUsers, putUser, deleteUser, postProfileImage } from "../controllers/user.controller.js";
import {upload} from '../config/multer.js'


const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser)
userRouter.post('/:id/images', upload.single("profileImage"), postProfileImage)
userRouter.put('/:id', putUser)
userRouter.delete('/:id', deleteUser)

export default userRouter;