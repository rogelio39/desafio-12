import { useNavigate } from "react-router-dom";
import styles from './NavBar.module.css';
import { useState, lazy, Suspense, useEffect } from "react";

const Logout = lazy(() => import("../logout/Logout"));

const NavBar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        try {
            const userDataFromStorage = localStorage.getItem('userData');
            if (userDataFromStorage) {
                setUserData(JSON.parse(userDataFromStorage));
                console.log(userData)
            }
        } catch (error) {
            console.log("error al tratar de obtener datos usuario", error);
        }
    }, []);

    const goToIndex = () => {
        navigate('/');
    };

    const toggleMenu = () => {
        if (!userData) {
            return <div>cargando...</div>
        } else {
            setMenuOpen(!menuOpen);
        }
    };

    const login = async () => {
        navigate('/login');
    };

    const goToProducts = () => {
        navigate('/products');
    };

    const goToNewProducts = () => {
        navigate('/new-products');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    const goToProfile = () => {
        navigate('/profile');
    };




    return (
        <div className={styles.navBar}>
            <h1>E-COMMERCE</h1>
            <button className={styles.menuButton} onClick={toggleMenu}>
                <span className={`${styles.menuIcon} ${menuOpen ? styles.open : styles.close}`}></span>
            </button>
            {menuOpen && (
                <div className={`${styles.menu}`}>
                    <button onClick={goToIndex} className={styles.buttonProducts}>INICIO</button>
                    <Suspense fallback={<div>cargando...</div>}>
                        <Logout />
                    </Suspense>
                    {userData && userData.rol === 'admin' && (
                        <button onClick={goToNewProducts}>AGREGAR NUEVOS PRODUCTOS</button>
                    )}
                    <button onClick={goToProducts} className={styles.buttonProducts}>PRODUCTOS</button>
                    <button onClick={login} className={styles.buttonLogin}>LOGIN</button>
                    <button onClick={goToRegister} className={styles.buttonRegister}>REGISTER</button>
                    <button onClick={goToProfile} className={styles.buttonViewProfile}>VER MI PERFIL</button>
                </div>
            )}
        </div>
    );
};

export default NavBar;








