import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css'
import { useEffect, useRef, useState } from 'react';

const Profile = () => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    let thumbnailProfile = '';
    const userRef = useRef({});
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            try {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    userRef.current = JSON.parse(storedUserData);
                }
                setLoading(false)
            } catch (error) {
                console.log("error a ltratar de obtener datos de usuario", error);
            }
        }, 2000)
    }, [])

    const goToAddProducts = () => {
        navigate(('/new-products'))
    }

    const goToEditProducts = () => {
        navigate(('/products'))
    }


    if (loading) {
        return <div>Cargando...</div>;
    }

    try {
        if (!userRef.current.thumbnail) {
            thumbnailProfile = [];
        }
        thumbnailProfile = `${import.meta.env.VITE_REACT_APP_LOCAL_URL}/uploads/profiles/${userRef.current.thumbnail[0].name}`;
    } catch (error) {
        console.log("error al tratar de ver imagen")
    }

    return (

        isAuthenticated ? (
            userRef.current.rol === 'admin' ?
                <div className={styles.profileData} key={userRef.current._id} >
                    <div>
                        <img src={thumbnailProfile} alt={userRef.current.first_name} />
                    </div>
                    <h1>Datos de usuario</h1>
                    <p>Nombre: {userRef.current.first_name}</p>
                    <p>Apellido: {userRef.current.last_name}</p>
                    <p>Rol: {userRef.current.rol}</p>
                    <p>Email: {userRef.current.email}</p>
                    <p>ID: {userRef.current._id}</p>
                    <div className={styles.div_buttons}>
                        <button onClick={goToAddProducts}>AGREGAR PRODUCTOS</button>
                        <button onClick={goToEditProducts}>EDITAR PRODUCTOS</button>
                    </div>
                </div > : <div className={styles.profileData} key={userRef.current._id} >
                    <div>
                        <img src={thumbnailProfile} alt={userRef.current.first_name} />
                    </div>
                    <h1>Datos de usuario</h1>
                    <p>Nombre: {userRef.current.first_name}</p>
                    <p>Apellido: {userRef.current.last_name}</p>
                    <p>Rol: {userRef.current.rol}</p>
                    <p>Email: {userRef.current.email}</p>
                    <p>ID: {userRef.current._id}</p>
                </div >
        ) : (<div>
            <p>NO EXISTE UNA SESSION ACTIVA, VUELVE AL LOGIN E INICIA SESSION</p>
        </div>)

    )
}

export default Profile
