//Importamos el hook useState y createContext para crear un contexto que va a almacenar toda la logica del carro de compras

import { useState, createContext } from "react";
import PropTypes from 'prop-types';
import { getCookiesByName } from "../utils/formsUtils";


//Creamos contexto con un valor inicial por default sera un objeto con la propiedad "carrito" con un array vacio.
export const CarritoContext = createContext({
    carrito: [],
    products: [],
    getProducts: () => { }, // Definimos una función vacía por defecto
});
const URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';


//creamos componente carritoProvider
export const CarritoProvider = ({ children }) => {

    //creamos estado carrito con useState
    const [carrito, setCarrito] = useState([]);
    const [products, setProducts] = useState([]);

    console.log(products);
    console.log(carrito);

    const fetchProducts = async () => {
        try {
            const token = getCookiesByName('jwtCookie');
            const response = await fetch(`${URL}/api/products`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setProducts(data.docs);
            } else if (response.status === 401) {
                const datos = await response.json();
                console.error('Error al acceder a productos, debes tener sesión iniciada', datos);
            } else {
                const data = await response.json();
                console.log("Error", data);
            }
        } catch (error) {
            console.log('Error al intentar acceder a esta URL', error);
        }
    };



    //agregamos metodos a carritoprovider que me permitiran manipular el carrito.


    //agregar productos
    // const addProduct = async ({ products, cid }) => {
    //     console.log("product en addProduct en carrito context", products)
    //     console.log("cid en addProduct en carrito context", cid)
    //     try {
    //         const token = getCookiesByName('jwtCookie');
    //         const response = await fetch(`${URL}/api/carts/${cid}`, {
    //             method: 'PUT',
    //             credentials: 'include',
    //             headers: {
    //                 'Authorization': `${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(products)
    //         })
    //         if (response.status == 200) {
    //             const data = await response.json();
    //             setCarrito(data.docs);
    //         } else if (response.status === 401) {
    //             const datos = await response.json()
    //             console.error('Error acceder a productos, debes tener iniciada session', datos);
    //         } else {
    //             const data = await response.json();
    //             console.log("error", data)
    //         }
    //     } catch (error) {
    //         console.log('error al intentar acceder a esta url', error);
    //     }


    //     // if (!isInCart(product._id)) {
    //     //     setCarrito(prev => [...prev, { product, quantity }])
    //     // } else {
    //     //     const updatedCart = carrito.map(prod => {
    //     //         if (prod.item.id === product._id) {
    //     //             return {...prod, quantity: prod.quantity + quantity }
    //     //         }
    //     //         return prod;
    //     //     }
    //     //     )
    // }

    //agregar productos
    const addProduct = (item, cantidad) => {
        if (!isInCart(item.id)) {
            setCarrito(prev => [...prev, { item, cantidad }])
        } else {
            const updatedCart = carrito.map(prod => {
                if (prod.item.id === item.id) {
                    return { ...prod, cantidad: prod.cantidad + cantidad }
                }
                return prod;
            }
            )
            setCarrito(updatedCart);
        }

        //la sintaxis: setCarrito(prod => [...prod, {item, cantidad}])
        // se utiliza para crear un nuevo array a partir del estado anterior del carrito y agregar un nuevo objeto que representa el nuevo producto (con el item que se agrega y la cantidad)
    }

    const finishCart = async (carrito, cid) => {
        const products = carrito.map(prod => ({
            _id: prod.item._id,
            quantity: prod.cantidad
        }));
        
        const requestBody = {
            products: products
        };
    
        try {
            const token = getCookiesByName('jwtCookie');
            const response = await fetch(`${URL}/api/carts/${cid}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (response.ok) {
                const data = await response.json();
                console.log("carrito", data.products);
            }
        } catch (error) {
            console.error("error", error)
        }
    }

    //funcion auxiliar 'isInCart'

    const isInCart = (id) => {
        return carrito.some(prod => prod.item.id === id);
    }


    const getTicket = async (cid)=> {
        try {
            const token = getCookiesByName('jwtCookie');
            const response = await fetch(`${URL}/api/carts/checkout/${cid}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json();
                console.log("TICKET", data.ticket);
                return data.ticket;
            }
        } catch (error) {
            console.error("error", error)
        }
    }






    //usamos el componente carritoContext.provider para enviar el valor actual del carrito y los metodos a los componentes de mi aplicacion que lo necesiten


    return (
        <CarritoContext.Provider value={{ carrito, products, addProduct, finishCart, fetchProducts, getTicket }}>
            {children}
        </CarritoContext.Provider>
    );


    //Children: es una propiedad especial que se utiliza para representar a todos aquellos componentes que puedan necesitar el carrito y sus metodos.
}

CarritoProvider.propTypes = {
    children: PropTypes.node.isRequired
};