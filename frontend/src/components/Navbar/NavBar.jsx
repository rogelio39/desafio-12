import { useNavigate } from "react-router-dom"
import Logout from "../logout/Logout"
import styles from './NavBar.module.css'
import { useState } from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    console.log(menuOpen)

    const login = async () => {
        navigate('/login')
    }

    const goToProducts = () => {
        navigate('/products')
    }

    const goToRegister = () => {
        navigate('/register')
    }
    const goToProfile = () => {
        navigate('/profile')
    }
    return (
        <div className={styles.navBar}>
            <h1>E-COMMERCE</h1>
            <button className={styles.menuButton} onClick={toggleMenu}>
                {menuOpen ? 'Cerrar Menu' : 'Menu'}
            </button>
            {
                menuOpen && (
                    <div className={`${styles.menu} ${menuOpen ? styles.visible :  styles.oculto}`}>
                        <Logout />
                        <button onClick={goToProducts} className={styles.buttonProducts}>PRODUCTOS</button>
                        <button onClick={login} className={styles.buttonLogin}>LOGIN</button>
                        <button onClick={goToRegister} className={styles.buttonRegister}>REGISTER</button>
                        <button onClick={goToProfile} className={styles.buttonViewProfile}>VER MI PERFIL</button>
                    </div>
                )
            }

        </div>
    )
}

export default NavBar
