// Classe d'erreur personnalisée — comme les exceptions DRF (NotFound, ValidationError...)
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }

    // Méthodes statiques — raccourcis pour les erreurs courantes
    static badRequest(message) {
        return new ApiError(400, message);
    }

    static notFound(message = 'Ressource non trouvée') {
        return new ApiError(404, message);
    }

    static internal(message = 'Erreur interne du serveur') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;
