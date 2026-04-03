const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

// Vérifie que l'utilisateur est connecté — comme IsAuthenticated en DRF
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Le token est envoyé dans le header: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw ApiError.unauthorized('Authentification requise');
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Charger l'utilisateur depuis la DB (comme request.user en Django)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        throw ApiError.unauthorized('Utilisateur non trouvé');
    }

    req.user = user;  // Attache l'utilisateur à la requête
    next();
});

// Vérifie le rôle — comme IsAdminUser en DRF
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden('Accès interdit — rôle insuffisant');
        }
        next();
    };
};

module.exports = { protect, authorize };
