import styles from './Product.module.css'
import PropTypes from 'prop-types';
import { useContext, lazy, Suspense } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProdCount = lazy(() => import('../ProdCount/ProdCount'));

//debo agregar logica para que al presionar en seguir comprando me mande de nuevo a products :D

const Product = ({ prod }) => {
    const { addProduct } = useContext(CarritoContext);
    const [quantity, setQuantity] = useState(0);
    const cid = localStorage.getItem('cid');
    const navigate = useNavigate();
    let thumbnailUrl;
    if (!prod && prod !== null) {
        return <p>Cargando producto...</p>;
    }



    const handleQuantity = async (quantity) => {
        setQuantity(quantity)
        try{
            await addProduct(prod, quantity)
        }catch(error){
            console.log("error al tratar de agregar producto", error)
        }
    }

    const goToCart = () => {
        navigate(`/checkout/${cid}`)
    }

    const keepBuying = () => {
        navigate('/products')
    }



    if (prod) {
        try{
            thumbnailUrl = prod.thumbnail && prod.thumbnail.length > 0
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_URL}/uploads/products/${prod.thumbnail[0].name}`
            : '';
        }catch(error){
            console.log("error al obtener img", error)
        }
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

                    <Suspense fallback={<div>Cargando...</div>}>
                        <ProdCount inicial={1} stock={prod ? prod.stock : 0} addFunction={handleQuantity} />
                    </Suspense>
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
