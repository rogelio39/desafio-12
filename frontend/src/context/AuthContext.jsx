import { useState, useContext, createContext } from "react";
import { BACKEND_URL, LOCAL_URL } from "../../config";
import PropTypes from 'prop-types';

const URL = BACKEND_URL;
console.log(URL)
const URL1 = LOCAL_URL;

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                    console.log(datos);
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

    


    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, setIsAuthenticated}}>
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