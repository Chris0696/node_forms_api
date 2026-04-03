import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Page pour afficher les réponses soumises à un formulaire
// Équivalent Django : une vue qui fait Response.objects.filter(form_id=id)
function FormResponses() {
    const { id } = useParams();           // Récupère l'ID du formulaire depuis l'URL
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [pagination, setPagination] = useState({});

    // useEffect = se lance au chargement de la page (comme componentDidMount)
    useEffect(() => {
        const fetchData = async () => {
            // On lance les 2 requêtes en parallèle (comme Promise.all côté backend)
            const [formRes, responsesRes] = await Promise.all([
                api.get(`/forms/${id}`),
                api.get(`/forms/${id}/responses`),
            ]);
            setForm(formRes.data);
            setResponses(responsesRes.data.results);
            setPagination(responsesRes.data.pagination);
        };
        fetchData();
    }, [id]);

    const fetchPage = async (page) => {
        const res = await api.get(`/forms/${id}/responses`, { params: { page } });
        setResponses(res.data.results);
        setPagination(res.data.pagination);
    };

    if (!form) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Reponses : {form.title}</h2>
            <p>{pagination.total} reponse(s) au total</p>

            {responses.length === 0 ? (
                <p>Aucune reponse pour le moment.</p>
            ) : (
                <table className="responses-table">
                    <thead>
                        <tr>
                            {/* En-têtes = les labels des champs du formulaire */}
                            {form.fields.map((field) => (
                                <th key={field._id}>{field.label}</th>
                            ))}
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((response) => (
                            <tr key={response._id}>
                                {form.fields.map((field) => (
                                    <td key={field._id}>
                                        {/* response.answers est un Map — on accède par clé */}
                                        {response.answers?.[field.label] || '-'}
                                    </td>
                                ))}
                                <td>{new Date(response.createdAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => fetchPage(i + 1)}
                            className={pagination.page === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <button onClick={() => navigate('/')} className="btn-secondary">Retour</button>
        </div>
    );
}

export default FormResponses;
