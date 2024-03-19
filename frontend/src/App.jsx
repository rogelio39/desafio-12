import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import { lazy, Suspense } from 'react';
const Register = lazy(() => import('./components/register/Register'));
const Login = lazy(() => import('./components/login/Login'));
const ProductsContainer = lazy(() => import('./components/ProductsContainer/ProductsContainer'));
const NewProducts = lazy(() => import('./components/newProducts/NewProducts'));
const Checkout = lazy(() => import('./components/checkout/Checkout'));
const NavBar = lazy(() => import('./components/Navbar/NavBar'));
const AccessDenied = lazy(() => import('./components/accessDenied/AccessDenied'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const ProductDetail = lazy(() => import('./components/ProductDetail/ProductDetail'));
const Inicio = lazy(() => import('./components/inicio/Inicio'));




const App = () => {
  return (
    <>
      <Suspense fallback={<div>Cargando...</div>}>
        <CarritoProvider>
          <BrowserRouter>
            <AuthProvider>
              <NavBar />
              <Routes>
                <Route path="/*" element={<AccessDenied />} />
                <Route path='/' element={<Inicio />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/products' element={<ProductsContainer />} />
                <Route path='/item/:id' element={<ProductDetail />} />
                <Route path='/new-products' element={<NewProducts />} />
                <Route path='/edit-products' element={<ProductsContainer />} />
                <Route path='/checkout/:cartId' element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </CarritoProvider>
      </Suspense>
    </>
  );
}

export default App;
