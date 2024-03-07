import { useState, useContext, createContext } from "react";
import PropTypes from 'prop-types';


const URL1 = import.meta.env.VITE_REACT_APP_LOCAL_URL;

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState([]);
    let [token, setToken] = useState(null)


    //METODOS PARA LOGIN, REGISTRO, LOGOUT Y CURRENT PARA DATOS
    const register = async (data) => {
        try {
            const response = await fetch(`${URL1}/api/session/register`, {
                method: 'POST',
                credentials : 'include',   
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const datos = await response.json();

            if (response.ok) {
                try {
                    console.log("datos en auth", datos)
                    return datos;
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
                localStorage.setItem('userData', JSON.stringify(datos.user))
                setUserData(datos.user);
                setToken(datos.token)
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

            const data = await response.json();
            if (response.status === 200) {
                // Limpia el token del almacenamiento local
                console.log("datos", data);
                localStorage.removeItem('jwtCookie');
                localStorage.removeItem('userData');
                localStorage.removeItem('cid');
                // Elimina la cookie del lado del cliente
                document.cookie = 'jwtCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
                setToken(null)
                setIsAuthenticated(false);
                setUserData([])
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
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                // Incluir cualquier token o información de autenticación necesario
            });
            const datos = await response.json();
            if (response.ok && datos.user._id) {
                // Si el usuario está autenticado, establece el estado y redirige
                console.log("usuario en current",datos.user)
                setIsAuthenticated(true);
                setUserData(datos.user);
                return datos.user
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
        <AuthContext.Provider value={{ isAuthenticated, login, logout, setIsAuthenticated, register, current, userData}}>
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
