
import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';


const Product = lazy(() => import('../product/Product'))

const ProductDetail = () => {
    const { getProductById } = useContext(CarritoContext);
    const [loading, setLoading] = useState(true);
    let productRef = useRef(null);
    const { id } = useParams();



    useEffect(() => {
        const getProduct = async () => {
            try{
                const product = await getProductById(id)
                productRef.current = product;
                setLoading(false)
            } catch(error){
                console.log("error al tratar de obtener producto porId", error)
            }
        }
        getProduct();
    }, [getProductById, id])


    return (
        <div>
            {loading ? ( // Si loading es true, muestra el mensaje de carga
                <div>Cargando...</div>
            ) : (
                <div>
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Product prod={productRef.current} />
                    </Suspense>
                </div>
            )}
        </div>
    )
}

export default ProductDetail;
