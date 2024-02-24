// Logout.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {  useState } from 'react';
import styles from './Logout.module.css'; // Importa el archivo CSS donde definiremos la animación

export default function Logout() {
    const { isAuthenticated, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();




    const handleLogout = async () => {
        setLoading(true);
        await logout();
        navigate('/login');
        setTimeout(() => {
            setLoading(false)
        }, 2000)
        console.log("authenticated", isAuthenticated);
    }





    return (
        <div>
            <button onClick={handleLogout} className={`${styles.logoutButton} ${loading ? `${styles.loading}` : ''}`}>
                {loading ? 'Cargando...' : 'LOGOUT'}
            </button>
        </div>
    )
}




