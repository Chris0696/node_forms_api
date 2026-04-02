const express = require('express');
const router = express.Router();
const { createForm, getAllForms, getFormById, updateForm, deleteForm, submitResponse, getResponsesByFormId } = require('../controllers/formController');
const validateForm = require('../validators/formValidator');
const validateResponse = require('../validators/responseValidator');
const { protect, authorize } = require('../middlewares/auth');

// Routes publiques — tout le monde peut voir les formulaires
router.get('/', getAllForms);
router.get('/:id', getFormById);

// Routes protégées — admin uniquement (créer, modifier, supprimer)
router.post('/', protect, authorize('admin'), validateForm, createForm);
router.put('/:id', protect, authorize('admin'), validateForm, updateForm);
router.delete('/:id', protect, authorize('admin'), deleteForm);

// Routes pour les réponses
router.post('/:id/responses', validateResponse, submitResponse);  // Valide PUIS soumet
router.get('/:id/responses', getResponsesByFormId);

module.exports = router;