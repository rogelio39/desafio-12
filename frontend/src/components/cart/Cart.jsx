import { useContext } from "react"
import { CarritoContext } from "../../context/CarritoContext"
import styles from  './Cart.module.css'



//agregar funcionalidad para mostrar carrito
const Cart = () => {
    const { carrito } = useContext(CarritoContext);
    let totalCompra;


    return (
        <div className={styles.cartInfo}>
            {carrito && carrito.map(prod => {
                const producto = prod.item;
                const cantidad = prod.cantidad;
                totalCompra = carrito.reduce((total, producto) => {
                    return total + (producto.item.price * producto.cantidad)
                }, 0);
        

                return (<div key={producto._id}>
                    <p>PRODUCTO: {producto.title}</p>
                    <p>PRECIO: {producto.price}</p>
                    <p>CANTIDAD: {cantidad}</p>
                    <p>TOTAL{producto.price * cantidad}</p>
                </div>)
            })
            }
            <p>TOTAL: {totalCompra}</p>
        </div>
    )
}

export default Cart




