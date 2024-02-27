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
                {products &&
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            {
                                userData.rol === 'user' ?  <ProductDetailContainer prod={prod} /> : <EditProducts prod= {prod}/>
                            }
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductsContainer;
