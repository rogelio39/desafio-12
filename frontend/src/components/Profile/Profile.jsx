import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css'
import { useEffect, useRef, useState } from 'react';

const Profile = () => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    let thumbnailProfile = '';
    const userRef = useRef({});

    useEffect(() => {
        setTimeout(() => {
            const storedUserData = localStorage.getItem('userData');
            console.log("storedUser",storedUserData)
            if (storedUserData) {
                userRef.current = JSON.parse(storedUserData);
            }
            setLoading(false)

        }, 2000)
    }, [])


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
    console.log("userdata en profile", userRef.current)

    return (

        isAuthenticated ? (

            <div className={styles.profileData} key={userRef.current._id} >
                <div>
                    <img src={thumbnailProfile} alt={userRef.current.first_name} />
                </div>
                <h1>Datos de usuario</h1>
                <p>Nombre: {userRef.current.first_name}</p>
                <p>Apellido: {userRef.current.last_name}</p>
                <p>Email: {userRef.current.email}</p>
                <p>ID: {userRef.current._id}</p>
            </div >
        ) : (<div>
            <p>NO EXISTE UNA SESSION ACTIVA, VUELVE AL LOGIN E INICIA SESSION</p>
        </div>)

    )
}

export default Profile
