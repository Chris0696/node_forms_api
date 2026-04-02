const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    type: { type: String, required: true },
    options: [String], // Pour les champs de type "select", "radio", etc.
    required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fields: [fieldSchema],
}, { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);