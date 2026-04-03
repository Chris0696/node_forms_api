import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import des pages — chaque page = une "view" Django
import Login from './pages/Login';
import FormList from './pages/FormList';
import FormSubmit from './pages/FormSubmit';
import FormCreate from './pages/FormCreate';
import FormResponses from './pages/FormResponses';

// Composant principal — comme urls.py + base.html en Django
function App() {
    // useState = stocke l'utilisateur connecté (null = pas connecté)
    // C'est comme request.user en Django, mais côté client
    const [user, setUser] = useState(() => {
        // Au chargement, vérifie si un token existe dans localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Décode le payload du JWT (la partie entre les 2 points)
                const payload = JSON.parse(atob(token.split('.')[1]));
                return { id: payload.id, role: payload.role };
            } catch {
                return null;
            }
        }
        return null;
    });

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <BrowserRouter>
            <div className="App">
                {/* Barre de navigation — comme base.html en Django */}
                <nav className="navbar">
                    <Link to="/" className="nav-brand">Dynamic Forms</Link>
                    <div className="nav-links">
                        <Link to="/">Formulaires</Link>
                        {user ? (
                            <>
                                <span className="nav-user">{user.role}</span>
                                <button onClick={handleLogout} className="btn-logout">Deconnexion</button>
                            </>
                        ) : (
                            <Link to="/login">Connexion</Link>
                        )}
                    </div>
                </nav>

                {/* Routes — comme urlpatterns en Django */}
                <main className="container">
                    <Routes>
                        {/* Page d'accueil = liste des formulaires */}
                        <Route path="/" element={<FormList user={user} />} />

                        {/* Connexion */}
                        <Route path="/login" element={<Login onLogin={setUser} />} />

                        {/* Remplir un formulaire (public) */}
                        <Route path="/forms/:id" element={<FormSubmit />} />

                        {/* Voir les réponses */}
                        <Route path="/forms/:id/responses" element={<FormResponses />} />

                        {/* Créer un formulaire (admin) */}
                        <Route path="/forms/new" element={
                            user?.role === 'admin' ? <FormCreate /> : <Navigate to="/login" />
                        } />

                        {/* Modifier un formulaire (admin) */}
                        <Route path="/forms/:id/edit" element={
                            user?.role === 'admin' ? <FormCreate /> : <Navigate to="/login" />
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
