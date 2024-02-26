
import { useRef, useEffect, useState } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {
    const { getProductById } = useContext(CarritoContext);
    const [loading, setLoading] = useState(true);
    let productRef = useRef(null);
    const { id } = useParams();



    useEffect(() => {
        const getProduct = async () => {
            const product = await getProductById(id)
            console.log("producto en useEffect de productDetail", product);
            productRef.current = product;
            setLoading(false)
        }
        getProduct();
    }, [getProductById, id])


    return (
        <div>
            {loading ? ( // Si loading es true, muestra el mensaje de carga
                <div>Cargando...</div>
            ) : (
                <div>
                    <Product prod={productRef.current} />
                </div>
            )}
        </div>
    )
}

export default ProductDetail;
