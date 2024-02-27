import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import ProductsContainer from './components/productsContainer/ProductsContainer';
import NewProducts from './components/newProducts/NewProducts';
import Checkout from './components/checkout/Checkout';
import { CarritoProvider } from './context/CarritoContext';
import NavBar from './components/navbar/NavBar';
import { AuthProvider } from './context/AuthContext';
import AccessDenied from './components/accessDenied/AccessDenied';
import Profile from './components/profile/Profile';
import ProductDetail from './components/productDetail/ProductDetail'
import './App.css'




const App = () => {
  return (
    <>
      <CarritoProvider>
        <BrowserRouter>
          <AuthProvider>
            <NavBar />
            <Routes>
              <Route path='/*' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/products' element={<ProductsContainer />} />
              <Route path='/item/:id' element={<ProductDetail/>}/>
              <Route path='/new-products' element={<NewProducts />} />
              <Route path='/edit-products' element={<ProductsContainer />} />
              <Route path='/checkout/:cartId' element={<Checkout />} />
              <Route path="/*" element={<AccessDenied/>} />
              <Route path = "/profile" element ={<Profile/>}/>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </CarritoProvider>
    </>
  );
}

export default App;
