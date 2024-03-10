import { useContext, useState } from "react";
import Ticket from "../ticket/Ticket";
import styles from './Checkout.module.css'
import { CarritoContext } from "../../context/CarritoContext"
import Cart from "../cart/Cart";


const Checkout = () => {
    const [ticket, setTicket] = useState([])
    // const [viewButtonOrder, setViewButtonOrder] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const { finishCart, carrito, getTicket } = useContext(CarritoContext);
    const cid = localStorage.getItem('cid');
    const { fetchProducts } = useContext(CarritoContext);
    const [charge, setCharge] = useState(false);

    const handleCharge = () => {
        setCharge(true);
    }

    const finishBuy = async () => {
        const cart = await finishCart(carrito, cid);
        console.log("carrito en checkout", cart)
        // setViewButtonOrder(true);
    }

    const getCheckout = async () => {
        const finalTicket = await getTicket(cid);
        setTicket(finalTicket);
        fetchProducts();
        setShowOrderDetails(true);
    }


    return (
        <div className={styles.checkout}>
        
            {
                showOrderDetails ? <Ticket ticket={ticket} /> : (
                    <div>
                        <Cart />
                        <button className={`${styles.getTicket} ${charge ? styles.loading : ''}`} onClick={() => { finishBuy(), handleCharge(), getCheckout() }}>FINALIZAR COMPRA</button>
                    </div>)

            }
        </div>
    )
}

export default Checkout
