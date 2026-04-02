const Form = require('../models/Form');
const Response = require('../models/Response');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

// Créer un nouveau formulaire
exports.createForm = asyncHandler(async (req, res) => {
    const { title, fields } = req.body;
    const form = new Form({ title, fields });
    await form.save();
    res.status(201).json(form);
});

// Lister tous les formulaires
exports.getAllForms = asyncHandler(async (req, res) => {
    const forms = await Form.find();
    res.json(forms);
});

// Récupérer un formulaire par son ID
exports.getFormById = asyncHandler(async (req, res) => {
    const form = await Form.findById(req.params.id);
    if (!form) {
        throw ApiError.notFound('Formulaire non trouvé');
    }
    res.json(form);
});

// Modifier un formulaire
exports.updateForm = asyncHandler(async (req, res) => {
    const form = await Form.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!form) {
        throw ApiError.notFound('Formulaire non trouvé');
    }
    res.json(form);
});

// Supprimer un formulaire
exports.deleteForm = asyncHandler(async (req, res) => {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
        throw ApiError.notFound('Formulaire non trouvé');
    }
    res.json({ message: 'Formulaire supprimé' });
});

// Soumettre une réponse
exports.submitResponse = asyncHandler(async (req, res) => {
    const response = new Response({ formId: req.params.id, answers: req.body.answers });
    await response.save();
    res.status(201).json(response);
});

// Récupérer les réponses d'un formulaire
exports.getResponsesByFormId = asyncHandler(async (req, res) => {
    const responses = await Response.find({ formId: req.params.id });
    res.json(responses);
});
