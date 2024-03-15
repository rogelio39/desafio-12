import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { isAuthenticated, login } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000)
            // Independientemente del resultado, marca como no cargando
        };

        checkAuthentication();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault()
        const datForm = new FormData(formRef.current) //Tranformo un HTML en un objet iterator
        const data = Object.fromEntries(datForm)
        login(data);
        navigate("/");
    }

    if (loading) {
        return <div>Logueandose...</div>;
    }

    return (
        <div>
            {(!isAuthenticated && !loading) && (
                <div className={isAuthenticated ? styles.loginOff : styles.loginOn}>
                    <h1 className={styles.login}>LOGIN</h1>
                    <form id="idForm" className={styles.form} onSubmit={handleSubmit} ref={formRef}>
                        <label htmlFor="email">Enter your email</label>
                        <input type="email" id="email" className={styles.inputEmail} name="email" autoComplete='userName' required />
                        <label htmlFor="password">Enter your password</label>
                        <input type="password" id="password" className={styles.inputPassword} name="password" autoComplete='currentPassword' required />
                        <button type="submit" className={styles.buttonLog}>LOGIN</button>
                        <button type="button" className={styles.buttonRegister}>REGISTER</button>
                        <button type="button" className={styles.gitHubButton}>Ingresar con GitHub</button>
                    </form>
                </div>
            )

            }
            <div className={isAuthenticated ? styles.loginOn : styles.loginOff}>
                <p>Ya has iniciado sesión. Puedes ir a la página de productos u otra sección.</p>
            </div>
        </div>
    )
}


export default Login






