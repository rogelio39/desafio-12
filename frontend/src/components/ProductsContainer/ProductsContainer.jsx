import styles from './ProductsContainer.module.css';
import { useEffect, useContext, useState } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import ProductDetailContainer from '../ProductDetailContainer/ProductDetailContainer';
import { useAuth } from '../../context/AuthContext';
import EditProducts from '../EditProducts/EditProducts';


const ProductsContainer = () => {
    const { products, fetchProducts } = useContext(CarritoContext);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [userRoleVerified, setUserRoleVerified] = useState(false);
    const { current, userData } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await current();
            setLoadingProducts(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (userData.rol) {
            setUserRoleVerified(true);
        }
    }, [userData.rol]);

    if (loadingProducts || !userRoleVerified) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div id="showProducts" className={styles.on}>
                {userData.rol === 'user' ? (
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            <ProductDetailContainer prod={prod} />
                        </div>
                    ))
                ) : (
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            <EditProducts prod={prod} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductsContainer;
