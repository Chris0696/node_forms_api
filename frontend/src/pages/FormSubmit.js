import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Page pour remplir et soumettre un formulaire
// C'est la page publique — tout le monde peut soumettre une réponse
function FormSubmit() {
    // useParams() = récupère les paramètres de l'URL
    // Si l'URL est /forms/abc123, alors id = 'abc123'
    // C'est comme kwargs['id'] dans une view Django
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);      // Le formulaire chargé depuis l'API
    const [answers, setAnswers] = useState({});   // Les réponses saisies par l'utilisateur
    const [message, setMessage] = useState('');    // Message de succès
    const [error, setError] = useState('');        // Message d'erreur

    // Charge le formulaire au montage du composant
    useEffect(() => {
        const fetchForm = async () => {
            const res = await api.get(`/forms/${id}`);
            setForm(res.data);
            // Initialise un objet vide avec tous les labels comme clés
            // { "Nom": "", "Email": "", "Message": "" }
            const initial = {};
            res.data.fields.forEach((field) => {
                initial[field.label] = '';
            });
            setAnswers(initial);
        };
        fetchForm();
    }, [id]); // [id] = re-exécute si l'id change dans l'URL

    // Met à jour une réponse quand l'utilisateur tape
    const handleChange = (label, value) => {
        // ...answers = spread operator = copie tout l'objet existant
        // [label]: value = écrase uniquement la clé modifiée
        // C'est comme: answers.update({label: value}) en Python
        setAnswers({ ...answers, [label]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post(`/forms/${id}/responses`, { answers });
            setMessage('Reponse envoyee avec succes !');
            // Réinitialise les champs après envoi
            const initial = {};
            form.fields.forEach((field) => {
                initial[field.label] = '';
            });
            setAnswers(initial);
        } catch (err) {
            // Gère les 2 formats d'erreur de notre API : { error: "..." } ou { errors: [...] }
            setError(err.response?.data?.error || err.response?.data?.errors?.join('. ') || 'Erreur');
        }
    };

    // Affiche "Chargement..." tant que le formulaire n'est pas chargé
    if (!form) return <p>Chargement...</p>;

    return (
        <div className="form-container">
            <h2>{form.title}</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Boucle sur chaque champ du formulaire — comme {% for field in form.fields %} */}
                {form.fields.map((field) => (
                    <div key={field._id} className="field-group">
                        <label>
                            {field.label} {field.required && <span className="required">*</span>}
                        </label>

                        {/* Rendu conditionnel selon le type de champ */}
                        {/* C'est comme {% if field.type == 'select' %} en Django */}
                        {field.options && field.options.length > 0 ? (
                            // Champ avec options → <select>
                            <select
                                value={answers[field.label] || ''}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                required={field.required}
                            >
                                <option value="">-- Choisir --</option>
                                {field.options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : field.type === 'textarea' ? (
                            // Champ textarea → <textarea>
                            <textarea
                                value={answers[field.label] || ''}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                required={field.required}
                            />
                        ) : (
                            // Tous les autres → <input> avec le type dynamique
                            <input
                                type={field.type}
                                value={answers[field.label] || ''}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <button onClick={() => navigate('/')} type="button" className="btn-secondary">Retour</button>
                    <button type="submit">Envoyer</button>
                </div>
            </form>
        </div>
    );
}

export default FormSubmit;
