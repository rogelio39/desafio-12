import { useNavigate } from "react-router-dom"
import Logout from "../logout/Logout"
import './NavBar.css'

const NavBar = () => {
    const navigate = useNavigate();

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
        <div className="navBar">
            <h1>E-COMMERCE</h1>
            <div>
                <button onClick={goToProducts}>PRODUCTOS</button>
            </div>
            <div className="buttons">
                <Logout />
                <button onClick={login}>LOGIN</button>
                <button onClick={goToRegister}>REGISTER</button>
                <button onClick={goToProfile}>VER MI PERFIL</button>
            </div>

        </div>
    )
}

export default NavBar
