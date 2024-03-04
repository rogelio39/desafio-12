import PropTypes from 'prop-types';
import styles from './EditProducts.module.css'
import { useRef, useState, useEffect, useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext.jsx';
import { getCookiesByName } from "../../utils/formsUtils.js";
import { useNavigate } from 'react-router-dom';

const EditProducts = ({ prod }) => {
    const formRef = useRef(null);
    const navigate = useNavigate();
    const { updateProduct } = useContext(CarritoContext);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    if (loading) {
        return <div>Cargando...</div>
    }


    const handleSubmit = async (e, id) => {
        e.preventDefault();
        try {
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData);
            const token = getCookiesByName('jwtCookie');
            updateProduct(id, data, token)
            navigate('/products')
        } catch (error) {
            console.log(error)
        }

    }

    const thumbnailUrl = prod.thumbnail && prod.thumbnail.length > 0
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/products/${prod.thumbnail[0].name}`
        : '';


    return (

        <div className={styles.products} key={prod._id}>
            
            <form id="productForm" className={styles.form} onSubmit={(e) => handleSubmit(e, prod._id)} ref={formRef}>
            <h1 className={styles.createProd} > CREAR NUEVO PRODUCTO</h1>
            
            <div className={styles.productImg}>
                <img src={thumbnailUrl} alt={prod.title} />
            </div>

                <label htmlFor="title">{prod.title}</label>
                <input type="text" id="title" className={styles.inputTitle} placeholder='MODIFICAR NOMBRE' name="title" required />

                <label htmlFor="description">{prod.description}</label>
                <input type="text" id="description" className={styles.inputDescription} placeholder='MODIFICAR DESCRIPCION' name="description" required />

                <label htmlFor="price">{prod.price}</label>
                <input type="number" id="price" className={styles.inputPrice} placeholder='MODIFICAR PRECIO' name="price" required />

                <label htmlFor="category">{prod.category}</label>
                <input type="text" id="category" className={styles.inputCategory} placeholder='MODIFICAR CATEGORIA' name="category" required />

                <label htmlFor="code">{prod.code}</label>
                <input type="text" id="code" className={styles.inputCode} placeholder='MODIFICAR CODIGO' name="code" required />


                <label htmlFor="stock">{prod.stock} </label>
                <input type="number" id="stock" className={styles.inputStock} placeholder='MODIFICAR STOCK' name="stock" required />

                <button type="submit" className={styles.buttonCreate}>CREAR</button>
            </form>
        </div>
    );


}


EditProducts.propTypes = {
    prod: PropTypes.object.isRequired
};


export default EditProducts
