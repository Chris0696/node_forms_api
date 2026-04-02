const express = require('express');
const router = express.Router();
const { createForm, getAllForms, getFormById, updateForm, deleteForm, submitResponse, getResponsesByFormId } = require('../controllers/formController');
const validateResponse = require('../validators/responseValidator');

// Routes pour les formulaires
router.post('/', createForm);
router.get('/', getAllForms);
router.get('/:id', getFormById);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);

// Routes pour les réponses
router.post('/:id/responses', validateResponse, submitResponse);  // Valide PUIS soumet
router.get('/:id/responses', getResponsesByFormId);

module.exports = router;