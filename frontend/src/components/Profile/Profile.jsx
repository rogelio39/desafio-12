import { useAuth } from '../../context/AuthContext';
import './Profile.css'
import { useEffect } from 'react';

const Profile = () => {
    const { userData, current, isAuthenticated } = useAuth();
    let thumbnailProfile = '';

    useEffect(() => {
        const getUserData = async () => {
            await current()
        };

        getUserData();
    }, [])



    thumbnailProfile = userData.thumbnail ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/profiles/${userData.thumbnail[0].name}`
        : '';



    return (

        isAuthenticated ? (

            <div className='profileData' key={userData._id} >
                <div>
                    <img src={thumbnailProfile} alt={userData.first_name} />
                </div>
                <h1>Datos de usuario</h1>
                <p>Nombre: {userData.first_name}</p>
                <p>Apellido: {userData.last_name}</p>
                <p>Email: {userData.email}</p>
                <p>ID: {userData._id}</p>
            </div >
        ) : (<div>
            <p>NO EXISTE UNA SESSION ACTIVA, VUELVE AL LOGIN E INICIA SESSION</p>
        </div>)

    )
}

export default Profile
