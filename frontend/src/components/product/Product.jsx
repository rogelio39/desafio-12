
import PropTypes from 'prop-types';
import ProdCount from '../ProdCount/ProdCount';
import { useState } from 'react';
import { useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { useNavigate } from 'react-router-dom';



const Product = ({ prod }) => {
    const [quantity, setQuantity] = useState(0)
    // const cid = localStorage.getItem('cid');
    const { addProduct } = useContext(CarritoContext);
    const navigate = useNavigate();
    const cid = localStorage.getItem('cid')


    const handleQuantity = (quantity) => {
        setQuantity(quantity)

        console.log('productos agregados ' + quantity);
        addProduct(prod, quantity)
    }

    const goToCart = () => {
        navigate(`/checkout/${cid}`)
    }


    return (
        <div>
            <div className="products" key={prod._id}>
                <p>Nombre: {prod.title}</p>
                <p>Descripcion: {prod.description}</p>
                <p>Precio: {prod.price}</p>
                <p>Stock disponible: {prod.stock}</p>
                {
                    quantity > 0 ? <div className='buttonsContainer'>
                        <button onClick={goToCart}>Terminar compra</button>
                        <button >Seguir comprando</button>
                    </div> : <ProdCount inicial={1} stock={prod.stock} addFunction={handleQuantity} />
                }
            </div>
        </div>
    )
}


Product.propTypes = {
    prod: PropTypes.object.isRequired
};

export default Product
