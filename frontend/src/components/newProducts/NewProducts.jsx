import { useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";

import './NewProducts.css';
import { CarritoContext } from "../../context/CarritoContext.jsx";


// Uso de la función para importar de forma síncrona

export const NewProducts = () => {

    const formRef = useRef(null);
    const navigate = useNavigate();
    const { createProduct } = useContext(CarritoContext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData);
            const token = getCookiesByName('jwtCookie');
            createProduct(data, token)
            navigate('/products')

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>
            <h1 className="createProd">CREAR NUEVO PRODUCTO</h1>
            <form id="idForm" onSubmit={handleSubmit} ref={formRef}>

                <label htmlFor="title">Nombre del producto</label>
                <input type="text" id="title" name="title" required />

                <label htmlFor="description">Descripcion del producto</label>
                <input type="text" id="description" name="description" required />

                <label htmlFor="price">precio</label>
                <input type="number" id="price" name="price" required />

                <label htmlFor="category">ingresa la categoria del producto</label>
                <input type="text" id="category" name="category" required />

                <label htmlFor="code">codigo del producto</label>
                <input type="text" id="code" name="code" required />


                <label htmlFor="stock">stock del producto</label>
                <input type="number" id="stock" name="stock" required />

                <button type="submit" id="buttonCreate">CREAR</button>
            </form>
            <div id="prodsContainer">
                <h1></h1>
            </div>
            <div id="errorContainer">

            </div>
        </div>
    )
}

export default NewProducts
