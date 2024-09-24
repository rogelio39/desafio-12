import styles from './ProductsContainer.module.css';
import { useEffect, useContext, lazy, Suspense, useState } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';

const ProductDetailContainer = lazy(() => import('../ProductDetailContainer/ProductDetailContainer'));
const EditProducts = lazy(() => import('../EditProducts/EditProducts'));



const ProductsContainer = () => {
    const {  fetchProducts } = useContext(CarritoContext);
    const { userData } = useAuth();
    const [products, setProducts] = useState([])
    useEffect(() => {
        try {
            const fetchData = async () => {
                const productsFetch = await fetchProducts();
                setProducts(productsFetch)
            };
            fetchData();
        } catch (error) {
            console.log("error al tratar de obtener productos", error)
        }
    }, []);






    return (
        <div>
            <div id="showProducts" className={styles.on}>
                {products &&
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            <Suspense fallback={<div>Cargando...</div>}>
                                {
                                    userData.rol === 'admin' ?  <EditProducts prod={prod} /> :  <ProductDetailContainer prod={prod} /> 
                                }
                            </Suspense>

                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductsContainer;
