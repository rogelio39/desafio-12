import { useState, useContext, createContext } from "react";
import PropTypes from 'prop-types';


const URL1 = import.meta.env.VITE_REACT_APP_MODE === 'DEVELOPMENT' ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL;




const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    
    const register = async(data) => {
        try {
            const response = await fetch(`${URL1}/api/session/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                try {
                    const datos = await response.json();
                    return {datos: datos, ok: 'ok'}
                } catch (error) {
                    console.error('Error al procesar la respuesta como JSON:', error);
                }
            } else {
                const errorData = await response.text();
                console.error('Error al registrar usuario:', errorData);
            }
        } catch (error) {
            console.error("error al procesar solicitud: ", error)
        }
    }
    const login = async (data) => {
        const response = await fetch(`${URL1}/api/session/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const datos = await response.json();

        try {
            if (response.ok) {
                document.cookie = `jwtCookie=${datos.token}; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/;`;
                localStorage.setItem('cid', datos.cid);
                setIsAuthenticated(true);
            } else {
                console.error('Credenciales incorrectas. Por favor, verifica tu email y contraseña.', datos);
            }
        } catch (error) {
            console.error('error al procesar respuesta del servidor: ', datos)
        }

    }


    const logout = async () => {
        try {
            const response = await fetch(`${URL1}/api/session/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.status === 200) {
                // Limpia el token del almacenamiento local
                const data = await response.json();
                console.log("datos", data);
                localStorage.removeItem('jwtCookie');
                // Elimina la cookie del lado del cliente
                document.cookie = 'jwtCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
                setIsAuthenticated(false);
            } else {
                console.error(`Error al desloguearse ${await response.text()}`);
            }
        } catch (error) {
            console.error(`Error al desloguearse ${error}`);
        }
    }

    const current = async () => {
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
        }
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, setIsAuthenticated, current, register }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext);
};



AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};