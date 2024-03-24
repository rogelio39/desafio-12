import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";
import styles from './NewProducts.module.css';
import { CarritoContext } from "../../context/CarritoContext.jsx";


// Uso de la función para importar de forma síncrona

export const NewProducts = () => {

    const formRef = useRef(null);
    const navigate = useNavigate();
    const { createProduct } = useContext(CarritoContext);
    const [loading, setLoading] = useState(true);
    const userRef = useRef({})


    useEffect(() => {
            try {
                const userData = localStorage.getItem('userData')
                if (userData) {
                    userRef.current = JSON.parse(userData);
                }
                setLoading(false)
            } catch (error) {
                console.log("error al tratar de obtener datos usuario", error)
            }
    }, [])

    if (loading) {
        return <div>Cargando...</div>
    }


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
            {userRef.current.rol === 'admin' ?
                <div>
                    <h1 className={styles.createProd}>CREAR NUEVO PRODUCTO</h1>
                    <form id="productForm" className={styles.form} onSubmit={handleSubmit} ref={formRef}>

                        <label htmlFor="title">Nombre del producto</label>
                        <input type="text" id="title" className={styles.inputTitle} name="title" required />

                        <label htmlFor="description">Descripcion del producto</label>
                        <input type="text" id="description" className={styles.inputDescription} name="description" required />

                        <label htmlFor="price">precio</label>
                        <input type="number" id="price" className={styles.inputPrice} name="price" required />

                        <label htmlFor="category">ingresa la categoria del producto</label>
                        <input type="text" id="category" className={styles.inputCategory} name="category" required />

                        <label htmlFor="code">codigo del producto</label>
                        <input type="text" id="code" className={styles.inputCode} name="code" required />


                        <label htmlFor="stock">stock del producto</label>
                        <input type="number" id="stock" className={styles.inputStock} name="stock" required />

                        <button type="submit" className={styles.buttonCreate}>CREAR</button>
                    </form>
                </div> : (<div>
                    <h1>NO ERES USUARIO ADMIN, NO TIENES PERMITIDO ACCEDER A ESTA RUTA</h1>
                </div>)
            }
        </div>
    )
}

export default NewProducts
