import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axios';

// Créez un contexte pour l'authentification
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("ACCESS_TOKEN"));
    const [user, setUser] = useState({name:''});

    const fetchUser = async () => {
        try {
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            setUser(null);
        }
    };

    // Charger l'utilisateur une seule fois lors de l'initialisation
    useEffect(() => {
        if (isLoggedIn) fetchUser();
    }, [isLoggedIn]);

    const logout = () => {
        api.post('/logout')
            .then(() => {
                localStorage.removeItem('ACCESS_TOKEN');
                setIsLoggedIn(false);
                setUser(null);
            })
            .catch(error => {
                console.error("Erreur lors de la déconnexion:", error);
            });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
