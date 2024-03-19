import styles from './ProductsContainer.module.css';
import { useEffect, useContext, lazy, Suspense } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';

const ProductDetailContainer = lazy(() => import('../ProductDetailContainer/ProductDetailContainer'));
const EditProducts = lazy(() => import('../EditProducts/EditProducts'));



const ProductsContainer = () => {
    const { products, fetchProducts } = useContext(CarritoContext);
    const { current, userData } = useAuth();

    useEffect(() => {
        try {
            const fetchData = async () => {
                await fetchProducts();
                await current();
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
                                    userData.rol === 'user' ? <ProductDetailContainer prod={prod} /> : <EditProducts prod={prod} />
                                }
                            </Suspense>

                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductsContainer;
