const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: { type: Map, of: String }, // Stocke les réponses sous forme de clé-valeur
}, { timestamps: true }
);

module.exports = mongoose.model('Response', responseSchema);