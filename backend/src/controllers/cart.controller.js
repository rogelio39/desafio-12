import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import logger from "../config/logger.js";

export const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid)
        if (cart) {
            res.status(200).send({ respuesta: 'ok', mensaje: cart });
        } else {
            logger.warning('El carrito no existe')
            res.status(404).send({ respuesta: 'error al consultar carrito', mensaje: 'error' });
        }
    } catch (error) {
        logger.error(`error al consultar carrito ${error}`)
        res.status(500).send({ respuesta: 'error al consultar carrito', mensaje: error })
    }
}
export const postCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid)
        if (cart) {
            const product = await productModel.findById(pid);
            if (product) {

                const index = cart.products.findIndex(prod => prod._id.toString() === pid);
                if (index != -1) {
                    console.log('cart en car.controller', cart.products)
                    cart.products[index].quantity += quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true });
                console.log("CARRITO ACTUALIZADO LUEGO DE ENVIARLO", respuesta)
                res.status(200).send({ respuesta: 'ok', mensaje: respuesta });
            } else {
                logger.warning('Error al agregar producto al carrito, producto no existe')
                res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'product not found' });
            }
        } else {
            logger.warning('Error al agregar producto al carrito, carrito no existe')
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        logger.error(`Error al agregar producto al carrito ${error}`);
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error })
    }
}


export const deleteProdCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid)
        if (cart) {
            //chequeamos si el producto existe en la base de datos.
            const product = await productModel.findById(pid);
            if (product) {
                //chequeamos si el producto existe en el carrito
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid);
                if (index != -1) {
                    cart.products.splice(index, 1);
                    //actualizamos el carrito
                    const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                    res.status(200).send({ respuesta: 'producto eliminado', mensaje: respuesta });
                } else {
                    logger.warning(`Error producto no existente, error al tratar de borrarlo`);
                    res.status(404).send({ respuesta: 'error', mensaje: 'producto no existente, error al tratar de borrarlo' })
                }
            } else {
                logger.warning(`Error al eliminar producto del carrito, producto  no existe`);
                res.status(404).send({ respuesta: 'error al agregar eliminar el producto del carrito', mensaje: 'product not found' });
            }
        } else {
            logger.warning(`Error al eliminar producto del carrito, carrito  no existe`);
            res.status(404).send({ respuesta: 'error al eliminar producto del carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        logger.error(`Error al eliminar producto del carrito ${error}`);
        res.status(500).send({ respuesta: 'error al eliminar producto del carrito', mensaje: error })
    }
}
export const putProductToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body
        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid);
        if (!cart) {
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }

        const productPromises = products.map(async (prod) => {
            const product = await productModel.findById(prod._id);
            if (!product) {
                logger.warning(`producto no encontrado`);
                throw new Error(`Producto no encontrado: ${prod._id}`);
            }
            const index = cart.products.findIndex(cartProd => cartProd._id.toString() === product._id);
            console.log("cart products", cart.products)
            if (index != -1) {
                logger.warning(`Producto ya existe`);
                throw new Error(`Producto ya existente: ${product._id.toString()}`);
            }
            return { id_prod: prod._id, quantity: prod.quantity };
        });


        try {
            // Esperamos a que se completen todas las promesas
            const productResults = await Promise.all(productPromises);
            // Si todos los productos se encontraron, actualizamos el carrito
            console.log("cart luego de agregar mas productos", cart.products)
            cart.products = productResults;
            const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
            res.status(200).send({ respuesta: 'ok', mensaje: respuesta, products: cart.products });
        } catch (error) {
            logger.warning(`Error al cargar lista de productos`);
            res.status(404).send({ respuesta: 'error', mensaje: 'error al cargar array de productos' });
        }
    } catch (error) {
        logger.error(`Error al agregar producto al carrito ${error}`);
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error.message })
    }
}

export const putUpdatedQuantityProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid);
        if (cart) {
            //chequeamos si el producto existe
            const product = await productModel.findById(pid);
            if (product) {
                //chequeamos si existe en carrito
                const index = cart.products.findIndex(cartProd => cartProd.id_prod._id.toString() == pid
                );
                if (index != -1) {
                    cart.products[index].quantity = quantity;
                    await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                    res.status(200).send({ respuesta: 'ok', mensaje: `cantidad de producto con id ${product._id} actualizada con exito a ${quantity}` });
                } else {
                    logger.warning(`Error al agregar producto al carrito, producto no existe`);
                    res.status(404).send({ respuesta: 'error', mensaje: 'error, el producto no existe, no puedes actualizar la cantidad de productos no existentes, agregar el producto a carrito primero' });
                }
            }
        } else {
            logger.warning(`Error al agregar producto al carrito, carrito no existe`);
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        logger.error(`Error al agregar producto al carrito ${error}`);
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error.message })
    }
}

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid)
        if (cart) {
            cart.products = [];
        } else {
            logger.warning(`Error al consultar carrito`);
            res.status(404).send({ respuesta: 'error al consultar carrito', mensaje: 'error' });
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products })
        res.status(200).send({ respuesta: 'ok', mensaje: respuesta });
    } catch (error) {
        res.status(500).send({ respuesta: 'error al consultar carrito', mensaje: error })
    }
}

