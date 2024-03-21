import { Router } from "express";
import { createTicket } from "../controllers/checkout.controller.js";
import {passportError, authorization} from '../utils/messagesError.js'

const checkoutRouter = Router();

checkoutRouter.post('/:cid', passportError('jwt'), authorization('user'), createTicket);

export default checkoutRouter;

