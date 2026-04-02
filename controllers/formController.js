const Form = require('../models/Form');
const Response = require('../models/Response');

// Créer un nouveau formulaire
exports.createForm = async (req, res) => {
    try {
        const { title, fields } = req.body;
        const form = new Form({ title, fields });
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lister tous les formulaires
exports.getAllForms = async (req, res) => {
    try {
        const forms = await Form.find();
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un formulaire par son ID
exports.getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 'Formulaire non trouvé' });
        }
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Modifier un formulaire
exports.updateForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!form) {
            return res.status(404).json({ error: 'Formulaire non trouvé' });
        }
        res.json(form);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un formulaire
exports.deleteForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 'Formulaire non trouvé' });
        }
        res.json({ message: 'Formulaire supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitResponse = async (req, res) => {
    try {
        // req.form est déjà chargé par le validator (pas besoin de refaire findById)
        const response = new Response({ formId: req.params.id, answers: req.body.answers });
        await response.save();
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getResponsesByFormId = async (req, res) => {
    try {
        const responses = await Response.find({ formId: req.params.id });
        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};