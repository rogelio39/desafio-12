import { useContext, useState } from "react";
import Ticket from "../ticket/Ticket";
import styles from './Checkout.module.css'
import { CarritoContext } from "../../context/CarritoContext"
import Cart from "../cart/Cart";


const Checkout = () => {
    const [ticket, setTicket] = useState([])
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const { finishCart, carrito, setCarrito , getTicket, fetchProducts } = useContext(CarritoContext);
    const cid = localStorage.getItem('cid');
    const [charge, setCharge] = useState(false);



    const getCheckout = async () => {
        setCharge(true);
        await finishCart(carrito, cid);
        const finalTicket = await getTicket(cid);
        setTicket(finalTicket);
        fetchProducts();
        if (finalTicket) {
            setShowOrderDetails(true);
            setCarrito([])
        }
    }



    return (
        <div className={styles.checkout}>

            {
                showOrderDetails ? <Ticket ticket={ticket} /> : (
                    <div>
                        <Cart />
                        <button className={`${styles.getTicket} ${charge ? styles.loading : ''}`} onClick={() => getCheckout()}>FINALIZAR COMPRA</button>
                    </div>)

            }
        </div>
    )
}

export default Checkout
