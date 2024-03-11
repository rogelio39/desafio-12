import { useEffect, useState } from 'react'
import styles from './Ticket.module.css'

const Ticket = (ticket) => {
    const [getTicket, setGetTicket] = useState({})

    useEffect(() => {
        setGetTicket(ticket.ticket)
    }, [ticket]
    )

    if(!getTicket){
        return <div>CARGANDO...VUELVE A LA PAGINA ANTERIOR</div>
    }
    console.log("tikcet", ticket)

    return (
        <div>
        {
            getTicket && (<div className={styles.ticket} >
                <h1>ORDEN DE COMPRA N°: {getTicket.code}</h1>
                <h2>Total: {getTicket.amount}</h2>
                <h2>Usuario: {getTicket.purchaser}</h2>
                <h2>Fecha de compra: {getTicket.purchase_datetime}</h2>
            </div >)
        }
        </div>
    )
}



export default Ticket
