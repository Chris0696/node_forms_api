const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

// Génère un token JWT — comme TokenObtainPairView en DRF
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Inscription
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.badRequest('Cet email est déjà utilisé');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

// Connexion
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Vérifier que l'email existe
    const user = await User.findOne({ email });
    if (!user) {
        throw ApiError.badRequest('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw ApiError.badRequest('Email ou mot de passe incorrect');
    }

    const token = generateToken(user);

    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

// Profil de l'utilisateur connecté — comme request.user en DRF
exports.getMe = asyncHandler(async (req, res) => {
    res.json({
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
});
