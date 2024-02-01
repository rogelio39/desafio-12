import './Login.css';
import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import { LOCAL_URL } from '../../../config';

const URL1 = LOCAL_URL;

const Login = () => {
    console.log("renderizando login")
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { isAuthenticated, login, setIsAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    console.log("isAuth", isAuthenticated)
    console.log("loading", loading)

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Realiza una solicitud al servidor para verificar la autenticación
                const response = await fetch(`${URL1}/api/session/current`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Incluir cualquier token o información de autenticación necesario
                });
    
                const datos = await response.json();
                console.log("Datos", datos.user.user)
                if (response.ok && datos.user.user._id) {
                    // Si el usuario está autenticado, establece el estado y redirige
                    setIsAuthenticated(true);
                } else {
                    // Si no está autenticado, establece el estado
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                setIsAuthenticated(false);
            } finally {
                // Independientemente del resultado, marca como no cargando
                setLoading(false);
            }
        };
    
        checkAuthentication();
    }, [isAuthenticated, navigate]);
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        const datForm = new FormData(formRef.current) //Tranformo un HTML en un objet iterator
        const data = Object.fromEntries(datForm)
        login(data);
        navigate("/products");
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {(!isAuthenticated && !loading) && (
                <div className={isAuthenticated ? 'loginOff' : 'loginOn'}>
                    <h1 className="login">LOGIN</h1>
                    <form id="idForm" onSubmit={handleSubmit} ref={formRef}>
                        <label htmlFor="email">Enter your email</label>
                        <input type="email" id="email" name="email" autoComplete='userName' required />
                        <label htmlFor="password">Enter your password</label>
                        <input type="password" id="password" name="password" autoComplete='currentPassword' required />
                        <button type="submit" id="buttonLog">LOGIN</button>
                        <button type="button" id="buttonRegister">REGISTER</button>
                        <button type="button" id="gitHubButton">Ingresar con GitHub</button>
                    </form>
                </div>
            )

            }
            <div className={isAuthenticated ? 'loginOn' : 'loginOff'}>
                <p>Ya has iniciado sesión. Puedes ir a la página de productos u otra sección.</p>
            </div>

            <div id="userContainer">
                <h1></h1>
            </div>
            <div id="errorContainer">
            </div>

        </div>
    )
}


export default Login






