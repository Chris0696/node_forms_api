// Enveloppe une fonction async pour capturer les erreurs automatiquement
// Sans ça, il faut écrire try/catch dans CHAQUE contrôleur
// Avec ça, les erreurs sont automatiquement passées au middleware errorHandler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
