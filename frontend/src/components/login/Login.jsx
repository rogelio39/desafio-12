import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { isAuthenticated, login, current } = useAuth();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuthentication = async () => {
            current()
            console.log("datos current en profile", await current());
            // Independientemente del resultado, marca como no cargando
            setLoading(false);

        };

        checkAuthentication();
    }, []);


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
                    <div className='form'>
                        <form id="idForm" className='form' onSubmit={handleSubmit} ref={formRef}>
                            <label htmlFor="email">Enter your email</label>
                            <input type="email" id="email" name="email" autoComplete='userName' required />
                            <label htmlFor="password">Enter your password</label>
                            <input type="password" id="password" name="password" autoComplete='currentPassword' required />
                            <button type="submit" id="buttonLog">LOGIN</button>
                            <button type="button" id="buttonRegister">REGISTER</button>
                            <button type="button" id="gitHubButton">Ingresar con GitHub</button>
                        </form>
                    </div>
                </div>
            )

            }
            <div className={isAuthenticated ? 'loginOn' : 'loginOff'}>
                <p>Ya has iniciado sesión. Puedes ir a la página de productos u otra sección.</p>
            </div>
        </div>
    )
}


export default Login






