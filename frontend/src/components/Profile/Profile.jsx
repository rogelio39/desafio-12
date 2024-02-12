import { useAuth } from '../../context/AuthContext';
import './Profile.css'
import { useEffect } from 'react';

const Profile = () => {
    const { userData, current } = useAuth();

    useEffect(() => {
        const getUserData = async () => {
            current()
        };

        getUserData();
    }, [])


    const thumbnailProfile =  userData.thumbnail ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/profiles/${userData.thumbnail[0].name}`
        : '';
    
    return (
        <div className='profileData' key= {userData._id}>
            <div>
                <img src={thumbnailProfile} alt={userData.first_name} />
            </div>
                <h1>Datos de usuario</h1>
                <p>Nombre: {userData.first_name}</p>
                <p>Apellido: {userData.last_name}</p>
                <p>Email: {userData.email}</p>
                <p>ID: {userData._id}</p>
            </div>
    )
}

export default Profile
