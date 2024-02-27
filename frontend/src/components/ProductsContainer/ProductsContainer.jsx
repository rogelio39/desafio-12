import styles from './ProductsContainer.module.css';
import { useEffect, useContext, useState} from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import ProductDetailContainer from '../productDetailContainer/ProductDetailContainer';
import { useAuth } from '../../context/AuthContext';
import EditProducts from '../editProducts/EditProducts'


const ProductsContainer = () => {
    const { products, fetchProducts } = useContext(CarritoContext);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const {current, userData} = useAuth();



    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await current();
            setLoadingProducts(false);
        };
        fetchData();
    }, []);

    if (loadingProducts) {
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
