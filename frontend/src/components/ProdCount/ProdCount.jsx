import { useState} from "react";
import PropTypes from 'prop-types';


const ProdCount = ({ inicial, stock, addFunction }) => {
    //primero desestructuramos
    const [contador, setContador] = useState(inicial); //entre parentesis colocamos el valor inicial del estado.

    const increment = () => {
        contador < stock && setContador(contador + 1);
    }


    const decrement = () => {
        contador > inicial && setContador(contador - 1);
    }


    return (
        <div className="addCartContainer">
            <button onClick={decrement} className="botonMenos"> - </button>
            <p> {contador} </p>
            <button onClick={increment} className="botonMas"> + </button>
            <button className='addCart' id="boton" onClick={() => addFunction(contador)}> Agregar carrito </button>
        </div>
    )


}


ProdCount.propTypes = {
    inicial: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    addFunction: PropTypes.func.isRequired
};


export default ProdCount