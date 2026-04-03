import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Page d'accueil — liste tous les formulaires avec recherche et pagination
// Équivalent Django : FormListView avec SearchFilter + PageNumberPagination
function FormList({ user }) {
    const [forms, setForms] = useState([]);          // Liste des formulaires
    const [search, setSearch] = useState('');         // Terme de recherche
    const [pagination, setPagination] = useState({}); // Infos de pagination

    // Fonction pour récupérer les formulaires depuis l'API
    const fetchForms = async (page = 1) => {
        const params = { page, limit: 10 };
        if (search) params.search = search;  // Ajoute ?search= si rempli
        const res = await api.get('/forms', { params });
        // params est automatiquement transformé en query string par axios
        // { page: 1, search: 'contact' } → ?page=1&search=contact
        setForms(res.data.results);
        setPagination(res.data.pagination);
    };

    // useEffect = exécute du code au montage du composant
    // Le [] vide = exécuter une seule fois au chargement (comme __init__ ou componentDidMount)
    // Sans [], ça s'exécuterait à chaque re-render (boucle infinie !)
    useEffect(() => {
        fetchForms();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (e) => {
        e.preventDefault();
        fetchForms();
    };

    // Suppression avec confirmation
    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce formulaire ?')) return;
        await api.delete(`/forms/${id}`);
        fetchForms(); // Recharge la liste après suppression
    };

    return (
        <div>
            <h2>Formulaires</h2>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Rechercher</button>
            </form>

            {/* Bouton "Nouveau" visible seulement pour les admins */}
            {/* user?.role === 'admin' = optional chaining (comme getattr(user, 'role', None) == 'admin') */}
            {user?.role === 'admin' && (
                <Link to="/forms/new" className="btn">+ Nouveau formulaire</Link>
            )}

            {/* Liste des formulaires — comme {% for form in forms %} en Django */}
            <div className="form-list">
                {forms.map((form) => (
                    <div key={form._id} className="form-card">
                        <h3>{form.title}</h3>
                        <p>{form.fields.length} champ(s)</p>
                        <div className="form-card-actions">
                            {/* Link = comme {% url 'form-detail' form.id %} en Django */}
                            <Link to={`/forms/${form._id}`}>Remplir</Link>
                            <Link to={`/forms/${form._id}/responses`}>Voir les reponses</Link>
                            {user?.role === 'admin' && (
                                <>
                                    <Link to={`/forms/${form._id}/edit`}>Modifier</Link>
                                    <button onClick={() => handleDelete(form._id)} className="btn-danger">Supprimer</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination — affiche les numéros de page si plus d'une page */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    {/* Array.from crée un tableau [1, 2, 3...] pour boucler */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => fetchForms(i + 1)}
                            className={pagination.page === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FormList;
