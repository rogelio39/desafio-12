import './Products.css';
import { useEffect, useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import Product from '../product/Product';

const Products = () => {
    const { products, fetchProducts } = useContext(CarritoContext);

    useEffect(() => {
        // Llama a fetchProducts solo si la lista de productos está vacía
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products]);

    return (
        <div>
            <div id="showProducts" className="on">
                {products &&
                    Object.values(products).map((prod) => (
                        <div key={prod._id}>
                            <Product prod={prod} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Products;
