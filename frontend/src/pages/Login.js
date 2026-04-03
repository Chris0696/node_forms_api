import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Page de connexion — comme LoginView en Django
// Props : onLogin = fonction pour mettre à jour l'utilisateur dans App.js
function Login({ onLogin }) {
    // useState = déclare une variable réactive (quand elle change, le composant se re-render)
    // C'est comme les variables dans le context Django, mais réactives
    const [email, setEmail] = useState('');       // Valeur du champ email
    const [password, setPassword] = useState(''); // Valeur du champ password
    const [error, setError] = useState('');       // Message d'erreur
    const navigate = useNavigate();               // Pour rediriger (comme redirect() en Django)

    // Fonction appelée quand le formulaire est soumis
    const handleSubmit = async (e) => {
        e.preventDefault();   // Empêche le rechargement de la page (comportement par défaut du <form>)
        setError('');         // Réinitialise l'erreur
        try {
            // Appel API — comme requests.post('/api/v1/auth/login', json={...})
            const res = await api.post('/auth/login', { email, password });

            // Stocke le token dans le navigateur (persiste même après fermeture)
            localStorage.setItem('token', res.data.token);

            // Met à jour l'utilisateur dans App.js (déclenche un re-render)
            onLogin(res.data.user);

            // Redirige vers la page d'accueil
            navigate('/');
        } catch (err) {
            // err.response?.data?.error = accès sécurisé (comme getattr() en Python)
            // Si err.response est undefined, pas d'erreur — retourne undefined
            setError(err.response?.data?.error || 'Erreur de connexion');
        }
    };

    // JSX = le template (comme un template Django, mais en JavaScript)
    // Les {} permettent d'insérer du JavaScript (comme {{ variable }} en Django)
    return (
        <div className="form-container">
            <h2>Connexion</h2>
            {/* Affiche l'erreur seulement si elle existe (comme {% if error %} en Django) */}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Met à jour la variable à chaque frappe
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Login;
