import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.css';

const Register = () => {
    const {register} = useAuth();

    const formRef = useRef(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData)
            const respuesta = register(data)
            if(respuesta.ok === 'Ok'){
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const redirectLogin = () => {
        navigate('/login');
    }

    return (
        <div>
            <h1 className="login">REGISTER</h1>
            <form id="idFormRegister" className={styles.form} onSubmit={handleSubmit} ref={formRef}>

                <label htmlFor="first_name">Enter your name</label>
                <input type="text" id="first_name" className={styles.inputName} name="first_name" required />

                <label htmlFor="last_name">Enter your lastname</label>
                <input type="text" id="last_name" className={styles.inputLastName} name="last_name" required />

                <label htmlFor="age">age</label>
                <input type="number" id="age" className={styles.inputAge} name="age" required />


                <label htmlFor="email">Enter your email</label>
                <input type="email" id="email" className={styles.inputEmail} name="email" required />

                <label htmlFor="password">Enter your password</label>
                <input type="password" id="password" className={styles.inputPassword} name="password" required />

                <button type="submit" className={styles.buttonRegister}>REGISTER</button>
                <button className={styles.buttonLogin} onClick={redirectLogin}>Si ya tienes cuenta, logueate</button>
                <button type="button" className={styles.buttonGitHub}>Ingresar con github</button>
            </form>
        </div>
    )
}


export default Register


