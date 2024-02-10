import { useContext, useState } from "react";
import Ticket from "../ticket/Ticket";
import './Checkout.css'
import { CarritoContext } from "../../context/CarritoContext"


const Checkout = () => {
    const [ticket, setTicket] = useState([])
    const [viewButtonOrder, setViewButtonOrder] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const {finishCart, carrito, getTicket} = useContext(CarritoContext);
    const cid = localStorage.getItem('cid');
    const {fetchProducts} = useContext(CarritoContext);

    const finishBuy = async () => {
        const cart = await finishCart(carrito, cid);
        console.log("carrito en checkout",cart)
        setViewButtonOrder(true);
    }

    const getCheckout = async () => {
        const finalTicket = await getTicket(cid);
        setTicket(finalTicket);
        fetchProducts();
        setShowOrderDetails(true);
    }


    return (
        <div className="checkout">
            <button className="getTicket" onClick={finishBuy}>FINALIZAR COMPRA</button>
            {
                viewButtonOrder && <button className="getCheckout" onClick={getCheckout}>VER DETALLES DE COMPRA</button>
            }
            {
                showOrderDetails && <Ticket ticket={ticket} />
            }
        </div>
    )
}

export default Checkout
