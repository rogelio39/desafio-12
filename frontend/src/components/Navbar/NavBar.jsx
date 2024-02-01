import { useNavigate } from "react-router-dom"
import Logout from "../logout/Logout"

const NavBar = () => {
    const navigate = useNavigate();

    const login = async () => {
        navigate('/login')
    }
    return (
        <div>
            <Logout />
            <button onClick={login}>Login</button>

        </div>
    )
}

export default NavBar
