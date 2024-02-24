import PropTypes from 'prop-types';
import styles from './ProductDetailContainer.module.css'
import { Link } from 'react-router-dom';

const ProductDetailContainer = ({ prod }) => {



    const thumbnailUrl = prod.thumbnail && prod.thumbnail.length > 0
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/products/${prod.thumbnail[0].name}`
        : '';


    return (
        <div className={styles.products} key={prod._id}>
            <div className={styles.productImg}>
                <img src={thumbnailUrl} alt={prod.title} />
            </div>
            <p>Nombre: {prod.title}</p>
            <p>Precio: {prod.price}</p>
            <p>Stock disponible: {prod.stock}</p>
            <p>Categoría: {prod.category}</p>
            <Link to={`/item/${prod._id}`}>
                <button className={styles.button}>VER DETALLES
                </button>
            </Link>
        </div>
    );


}


ProductDetailContainer.propTypes = {
    prod: PropTypes.object.isRequired
};

export default ProductDetailContainer;