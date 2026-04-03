import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Page admin pour créer ou modifier un formulaire
// Le même composant gère les 2 cas grâce à la présence ou non d'un :id dans l'URL
// Équivalent Django : CreateView + UpdateView combinés
function FormCreate() {
    const { id } = useParams();           // undefined si /forms/new, rempli si /forms/:id/edit
    const navigate = useNavigate();
    const isEdit = Boolean(id);            // true = modification, false = création

    const [title, setTitle] = useState('');
    // Un formulaire a au minimum 1 champ
    const [fields, setFields] = useState([{ label: '', type: 'text', options: [], required: false }]);
    const [error, setError] = useState('');

    // Si on est en mode édition, charge le formulaire existant
    useEffect(() => {
        if (isEdit) {
            const fetchForm = async () => {
                const res = await api.get(`/forms/${id}`);
                setTitle(res.data.title);
                // Transforme les champs pour ne garder que ce qu'on édite
                setFields(res.data.fields.map((f) => ({
                    label: f.label,
                    type: f.type,
                    options: f.options || [],
                    required: f.required,
                })));
            };
            fetchForm();
        }
    }, [id, isEdit]);

    // Ajoute un nouveau champ vide à la liste
    const addField = () => {
        setFields([...fields, { label: '', type: 'text', options: [], required: false }]);
    };

    // Supprime un champ par son index
    const removeField = (index) => {
        // filter retourne un nouveau tableau sans l'élément à l'index donné
        setFields(fields.filter((_, i) => i !== index));
    };

    // Met à jour une propriété d'un champ (label, type, required)
    const updateField = (index, key, value) => {
        const updated = [...fields]; // Copie le tableau (immutabilité React)
        updated[index][key] = value;
        setFields(updated);
    };

    // Convertit une string "Option 1, Option 2" en tableau ["Option 1", "Option 2"]
    const updateOptions = (index, value) => {
        const updated = [...fields];
        updated[index].options = value.split(',').map((o) => o.trim()).filter(Boolean);
        setFields(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEdit) {
                await api.put(`/forms/${id}`, { title, fields });
            } else {
                await api.post('/forms', { title, fields });
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur');
        }
    };

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Modifier le formulaire' : 'Nouveau formulaire'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="field-group">
                    <label>Titre du formulaire</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Formulaire de contact"
                        required
                    />
                </div>

                <h3>Champs</h3>
                {/* Chaque champ est un bloc éditable */}
                {fields.map((field, index) => (
                    <div key={index} className="field-builder">
                        <input
                            type="text"
                            placeholder="Nom du champ"
                            value={field.label}
                            onChange={(e) => updateField(index, 'label', e.target.value)}
                            required
                        />
                        <select
                            value={field.type}
                            onChange={(e) => updateField(index, 'type', e.target.value)}
                        >
                            <option value="text">Texte</option>
                            <option value="email">Email</option>
                            <option value="number">Nombre</option>
                            <option value="textarea">Zone de texte</option>
                            <option value="select">Liste deroulante</option>
                            <option value="radio">Bouton radio</option>
                            <option value="checkbox">Case a cocher</option>
                            <option value="date">Date</option>
                        </select>
                        {/* Affiche le champ options seulement pour select et radio */}
                        {['select', 'radio'].includes(field.type) && (
                            <input
                                type="text"
                                placeholder="Options (separees par des virgules)"
                                value={field.options.join(', ')}
                                onChange={(e) => updateOptions(index, e.target.value)}
                            />
                        )}
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                            />
                            Obligatoire
                        </label>
                        {/* On ne peut pas supprimer si c'est le dernier champ */}
                        {fields.length > 1 && (
                            <button type="button" onClick={() => removeField(index)} className="btn-danger">X</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addField} className="btn-secondary">+ Ajouter un champ</button>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <button onClick={() => navigate('/')} type="button" className="btn-secondary">Retour</button>
                    {/* <button type="submit">Envoyer</button> */}
                    <button type="submit">{isEdit ? 'Modifier' : 'Creer'}</button>
                </div>

                {/* <button type="button" onClick={addField} className="btn-secondary">+ Ajouter un champ</button> */}
                {/* <button type="submit">{isEdit ? 'Modifier' : 'Creer'}</button> */}
            </form>
            {/* <button onClick={() => navigate('/')} className="btn-secondary">Retour</button> */}
        </div>
    );
}

export default FormCreate;
