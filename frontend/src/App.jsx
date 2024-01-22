import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Products from './components/products/Products';
import NewProducts from './components/newProducts/NewProducts';
import './App.css'
import Checkout from './components/checkout/Checkout';
import { CarritoProvider } from './context/CarritoContext';


const App = () => {
  return (
    <>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/products' element={<Products />} />
            <Route path='/new-products' element={<NewProducts />} />
            <Route path='/checkout/:cartId' element={<Checkout />} />
            <Route path="/*" element={<h2>Seccion en construccion</h2>} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </>
  );
}

export default App;
