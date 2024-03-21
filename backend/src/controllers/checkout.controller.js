import { ticketModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import { userModel } from "../models/users.models.js";
import { productModel } from "../models/products.models.js";
import logger from "../config/logger.js";
import { finishBuy } from "./nodemailer.controller.js";

export const createTicket = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        const user = await userModel.findOne({ cart: cid });
        let purchaser = user.email;
        let amount = 0;
        let invalidProducts = [];
        let discountPremiumUsers = 0.1;
        if(!req.user){
            logger.warning('No existe un usuario activo para realizar la compra')
            res.status(400).send({ERROR: "No existe usuario activo."})
            return null
        }
        if(req.user.cart != cid){
            logger.error('El id del carrito de la url no coincide con el id del carrito del usuario')
            res.status(400).send({ERROR:"El id del carrito de la url no coincide con el id del carrito del usuario"})
            return null 
        }
        if (cart) {
            //FILTRAR PRODUCTOS QUE SUPEREN EL STOCK PARA AGREGARLOS A LA ORDEN DEL CHECKOUT
            const filteredProducts = await Promise.all(cart.products.map(async (prod) => {
                if (!prod.id_prod || !prod.id_prod._id) {
                    logger.warning(`Producto no válido: ${prod}`);
                    return null;
                }
                let product = await productModel.findById(prod.id_prod._id);
                if (prod.quantity > product.stock) {
                    logger.warning(`No hay productos suficientes: Cantidad de producto ${product.stock}, cantidad ingresada ${prod.quantity}`);
                    //array para actualizar carrito
                    invalidProducts.push(prod);
                    return null
                } else {
                    const updatedStock = product.stock - prod.quantity;
                    await productModel.findByIdAndUpdate(product._id, { stock: updatedStock });
                    return prod;
                }
            }));

            // Filtra los productos que cumplen la condición y elimina los nulos
            const validProducts = filteredProducts.filter(Boolean);

            //ACTUALIZAR CARRITO PARA QUE QUEDE SOLO CON AQUELLOS PRODUCTOS CUYA CANTIDAD FUE SUPERIOR AL STOCK
            await cartModel.findByIdAndUpdate(cid, { products: invalidProducts })
            if (validProducts.length > 0) {
                validProducts.forEach(prod => {
                    if (user.rol === "premium") {
                        amount += (prod.quantity * prod.id_prod.price) * (1 - discountPremiumUsers);
                        logger.info(`usuario premium total, ${amount}, usuario: ${user}`)
                    } else {
                        amount += prod.quantity * prod.id_prod.price;
                        logger.info(`usuario normal, ${amount}, usuario: ${user}`)
                    }
                })
                const ticket = await ticketModel.create({ amount, purchaser });
                if (ticket) {
                    finishBuy(purchaser, ticket);
                    res.status(200).send({ ticket })
                } else {
                    logger.warning(`error al generar ticket. Alguno de los datos no son correcto: Usuario: ${user}, cart ${cart} `)
                    res.status(404).send({ error: "error al generar ticket. Alguno de los datos no son correctos" });
                }
            } else {
                logger.warning(`error al generar ticket. No hay productos válidos en el carrito ${cart}`)
                res.status(404).send({ error: "No hay productos válidos en el carrito" });
            }
        } else {
            res.status(404).send({ "error al procesar carrito": error })
        }
    } catch (error) {
        logger.error("Error en el servidor:", error);
        res.status(500).send({ error: "Error en el servidor", details: error });
    }

}



