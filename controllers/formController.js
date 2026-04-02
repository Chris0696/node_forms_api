const Form = require('../models/Form');
const Response = require('../models/Response');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginator');

// Créer un nouveau formulaire
exports.createForm = asyncHandler(async (req, res) => {
    const { title, fields } = req.body;
    const form = new Form({ title, fields });
    await form.save();
    res.status(201).json(form);
});

// Lister tous les formulaires (avec pagination, recherche et filtres)
exports.getAllForms = asyncHandler(async (req, res) => {
    const filter = {};

    // Recherche par titre : ?search=contact
    // Comme SearchFilter en DRF
    if (req.query.search) {
        filter.title = { $regex: req.query.search, $options: 'i' };
    }

    // Filtre par date : ?from=2026-01-01&to=2026-12-31
    // Comme django-filter DateFromToRangeFilter
    if (req.query.from || req.query.to) {
        filter.createdAt = {};
        if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
        if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const result = await paginate(Form, filter, req.query);
    res.json(result);
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

// Récupérer les réponses d'un formulaire (avec pagination et filtres)
exports.getResponsesByFormId = asyncHandler(async (req, res) => {
    const filter = { formId: req.params.id };

    // Filtre par date : ?from=2026-04-01&to=2026-04-02
    if (req.query.from || req.query.to) {
        filter.createdAt = {};
        if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
        if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const result = await paginate(Response, filter, req.query);
    res.json(result);
});
