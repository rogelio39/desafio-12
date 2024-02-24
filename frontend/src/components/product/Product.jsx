import styles from './Product.module.css'
import PropTypes from 'prop-types';
import ProdCount from '../ProdCount/ProdCount';
import { useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


//debo agregar logica para que al presionar en seguir comprando me mande de nuevo a products :D

const Product = ({prod}) => {
    const { addProduct} = useContext(CarritoContext);
    const [quantity, setQuantity] = useState(0);
    const cid = localStorage.getItem('cid');
    const navigate = useNavigate();

    if (!prod && prod !== null) {
        return <p>Cargando producto...</p>;
    }


    const handleQuantity = (quantity) => {
        setQuantity(quantity)
        console.log('productos agregados ' + quantity);
        addProduct(prod , quantity)
    }

    const goToCart = () => {
        navigate(`/checkout/${cid}`)
    }

    const keepBuying = () => {
        navigate('/products')
    }

    if (prod) {
        console.log("datos de prod", prod)
        const thumbnailUrl = prod.thumbnail && prod.thumbnail.length > 0
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_URL}/uploads/products/${prod.thumbnail[0].name}`
            : '';
        return (
            <div className={styles.product}>
                <div className={styles.productImg}>
                    <img src={thumbnailUrl} alt={prod.title} />
                </div>
                <p>Nombre: {prod.title}</p>
                <p>Precio: {prod.price}</p>
                <p>Stock disponible: {prod.stock}</p>
                {quantity > 0 ? (
                    <div className={styles.buttonsContainer}>
                        <button onClick={goToCart}>IR A CHECKOUT</button>
                        <button onClick={keepBuying}>SEGUIR COMPRANDO</button>
                    </div>
                ) : (
                    <ProdCount inicial={1} stock={prod ? prod.stock : 0} addFunction={handleQuantity} />
                )}

            </div>
        )
    }

    return <p>No se encontraron datos del producto.</p>;

}



Product.propTypes = {
    prod: PropTypes.shape({
        title: PropTypes.string,
        price: PropTypes.number,
        stock: PropTypes.number,
        thumbnail: PropTypes.array
        // Agrega aquí otras propiedades si es necesario
    }),
};



export default Product
