import styles from './Products.module.css';
import { useEffect, useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import Product from '../product/Product';

const Products = () => {
    const { products, fetchProducts } = useContext(CarritoContext);

    useEffect(() => {
        if (!products || products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products]);

    return (
        <div>
            <div id="showProducts" className={styles.on}>
                {products &&
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            <Product prod={prod} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Products;
