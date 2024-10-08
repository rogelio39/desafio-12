//Importamos el hook useState y createContext para crear un contexto que va a almacenar toda la logica del carro de compras

import { useState, createContext } from "react";
import PropTypes from 'prop-types';
import { getCookiesByName } from "../utils/formsUtils";


const URL1 = import.meta.env.VITE_REACT_APP_LOCAL_URL;

//Creamos contexto con un valor inicial por default sera un objeto con la propiedad "carrito" con un array vacio.
export const CarritoContext = createContext({
    carrito: [],
    getProducts: () => { }, // Definimos una función vacía por defecto
});


//creamos componente carritoProvider
export const CarritoProvider = ({ children }) => {

    //creamos estado carrito con useState
    const [carrito, setCarrito] = useState([]);


    const fetchProducts = async () => {
        try {
            const response = await fetch(`${URL1}/api/products`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.docs
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

    const getProductById = async (id) => {
        try {
            const response = await fetch(`${URL1}/api/products/${id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                return data;
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

    //agregar productos
    const addProduct = async (item, cantidad) => {
        if (!isInCart(item._id)) {
            setCarrito(prev => [...prev, { item, cantidad }])
        } else {
            const updatedCart = carrito.map(prod => {
                if (prod.item._id === item._id) {
                    return { ...prod, cantidad: prod.cantidad + cantidad }
                }
                return prod;
            }
            )
            setCarrito(updatedCart);
        }

        //la sintaxis: setCarrito(prod => [...prod, {item, cantidad}])
        // se utiliza para crear un nuevo array a partir del estado anterior del carrito y agregar un nuevo objeto que representa el nuevo producto (con el item que se agrega y la cantidad)
    };

    const createProduct = async (data, token) => {
        try {
            const response = await fetch(`${URL1}/api/products`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.status == 201) {
                console.log("producto creado con exito");
            } else if (response.status === 401) {
                const datos = await response.json()
                console.error('Error al intentar crear producto', datos);
            } else {
                const datos = await response.json();
                console.log(datos)
            }
        } catch (error) {
            console.log('error al crear producto', error);
        }
    };


    const updateProduct = async (id, data, token) => {
        console.log("datos de producto en update", id, data, token)
        try {
            const response = await fetch(`${URL1}/api/products/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const datos = await response.json();

            if (response.ok) {
                console.log("producto creado con exito");
            } else if (response.status === 401) {
                console.error('Error al intentar actualizar producto', datos);
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log('error al actualizar producto', error);
        }
    };



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
            const response = await fetch(`${URL1}/api/carts/${cid}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (response.ok) {
                await response.json();
            }
        } catch (error) {
            console.error("error", error)
        }
    };

    //funcion auxiliar 'isInCart'

    const isInCart = (id) => {
        return carrito.some(prod => prod.item.id === id);
    };


    const getTicket = async (cid) => {
        try {
            const token = getCookiesByName('jwtCookie');
            const response = await fetch(`${URL1}/api/carts/checkout/${cid}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json();
                return data.ticket
            }
        } catch (error) {
            console.error("error", error)
        }
    };






    //usamos el componente carritoContext.provider para enviar el valor actual del carrito y los metodos a los componentes de mi aplicacion que lo necesiten


    return (
        <CarritoContext.Provider value={{ carrito, setCarrito, addProduct, createProduct, updateProduct, finishCart, fetchProducts, getTicket, getProductById }}>
            {children}
        </CarritoContext.Provider>
    );


    //Children: es una propiedad especial que se utiliza para representar a todos aquellos componentes que puedan necesitar el carrito y sus metodos.
}

CarritoProvider.propTypes = {
    children: PropTypes.node.isRequired
};