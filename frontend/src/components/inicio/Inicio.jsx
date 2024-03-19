import { useState, useEffect, useContext } from 'react';
import styles from './Inicio.module.css';
import { Link } from 'react-router-dom';
import { CarritoContext } from '../../context/CarritoContext';

const Inicio = () => {
    const [loadingProducts, setLoadingProducts] = useState(true)
    const { products, fetchProducts } = useContext(CarritoContext);

    useEffect(() => {
        const fetchData = async () => {
            try{
                await fetchProducts();
                setLoadingProducts(false);
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
                <h1>Tu e-commerce</h1>
                <p>
                    ¡Claro! Aquí tienes un ejemplo de texto que podrías utilizar para la página de inicio de un eCommerce:
                    ¡Bienvenido a [Nombre del eCommerce]!
                    Descubre una experiencia de compra en línea excepcional con nosotros. En [Nombre del eCommerce], nos enorgullecemos de ofrecerte una amplia selección de productos de alta calidad que se adaptan a tus necesidades y estilo de vida. Desde moda y belleza hasta tecnología y hogar, tenemos todo lo que necesitas en un solo lugar.
                    Explora nuestras colecciones cuidadosamente seleccionadas y encuentra los productos más populares y las últimas tendencias de la temporada. Con una interfaz fácil de usar y funciones de búsqueda avanzada, encontrar lo que buscas nunca ha sido tan sencillo.
                    Además, nuestra atención al cliente dedicada está aquí para ayudarte en cada paso del camino. Ya sea que necesites asistencia con tu compra, consejos de estilo o información sobre productos, nuestro equipo está listo para brindarte el mejor servicio posible.
                    ¿Qué esperas? ¡Comienza tu viaje de compras en línea hoy mismo con [Nombre del eCommerce] y descubre una nueva forma de comprar!
                    ¡Gracias por elegirnos!</p>
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
                                    ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/products/${prod.thumbnail[0].name}`
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
