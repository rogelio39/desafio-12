import { useState, useEffect, useContext } from 'react';
import styles from './Inicio.module.css';
import { Link } from 'react-router-dom';
import { CarritoContext } from '../../context/CarritoContext';

const Inicio = () => {
    const [loadingProducts, setLoadingProducts] = useState(true)
    const { fetchProducts } = useContext(CarritoContext);
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try{
                const productsByFetch = await fetchProducts();
                console.log("products:", productsByFetch)
                if(productsByFetch){
                    setProducts(productsByFetch)
                    setLoadingProducts(false);
                }
            }catch(error){
                console.log("error al obtener productos", error)
            }
        };
        fetchData();
    }, []);

    if (loadingProducts) {
        return <div>Cargando...</div>
    }


    return (
        <div className={styles.inicio}>
            <div className={styles.text}>
                <h1>GOLOSINERIA DEL ESTE</h1>
                <p>
                ¡Bienvenidos a Golosinas del Este! Somos la mejor opción en Banda del Río Salí para todos los amantes de las golosinas. Ofrecemos una amplia variedad de productos dulces y snacks a precios minoristas y mayoristas. Ya sea que busques abastecer tu negocio o simplemente darte un gusto, en Golosinas del Este encontrarás calidad, variedad y el mejor precio. ¡Te esperamos para endulzar tu día con nuestras deliciosas opciones! 🍬✨</p>
            </div>
            <div className={styles.productsSection}>
                <Link to={`/products`}>
                    <button className={styles.button}>IR A LA SECCION DE PRODUCTOS
                    </button>
                </Link>
                {
                    products && products.map((prod) => (
                        <div className={styles.prod} key={prod._id}>
                            <div className={styles.productImg}>
                                <img src={prod.thumbnail && prod.thumbnail.length > 0
                                    ? `${import.meta.env.VITE_REACT_APP_LOCAL_URL}/uploads/products/${prod.thumbnail[0].name}`
                                    : ''} alt={prod.title} />
                            </div>
                            <p>Nombre: {prod.title}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Inicio
