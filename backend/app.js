const connectDB = require('./configs/db');
const express = require('express');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/forms', formRoutes);

// Route test — comme urlpatterns + view en Django
app.get('/', (req, res) => {
    res.json({ message: 'Dynamic Forms API is running' });
});

// Middleware d'erreur global — DOIT être après les routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});