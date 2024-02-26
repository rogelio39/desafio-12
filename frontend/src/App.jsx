import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProductsContainer from './components/productsContainer/ProductsContainer';
import NewProducts from './components/NewProducts/NewProducts';
import Checkout from './components/Checkout/Checkout';
import { CarritoProvider } from './context/CarritoContext';
import NavBar from './components/Navbar/NavBar';
import { AuthProvider } from './context/AuthContext';
import AccessDenied from './components/AccessDenied/AccessDenied';
import Profile from './components/profile/Profile';
import ProductDetail from './components/ProductDetail/ProductDetail'
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
