import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';


export default function Logout() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        logout();

        if (!isAuthenticated) {
            navigate('/login');
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>LOGOUT</button>
        </div>
    )
}
