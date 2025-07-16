// server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // pour charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 8000;

// === CORS ===
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

// === Middlewares ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Static files ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Multer config ===
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        cb(null, `${safeName}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers PDF sont autorisés.'));
        }
    }
});

// === Route POST /api/apply ===
app.post('/api/apply', upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'cni', maxCount: 1 }
]), (req, res) => {
    const { fullName, email, phone, field, school, duration, startDate, endDate, motivation } = req.body;

    if (![fullName, email, phone, field, school, duration, startDate, endDate, motivation].every(Boolean)) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs requis.' });
    }

    if (!req.files?.cv || !req.files?.certificate || !req.files?.cni) {
        return res.status(400).json({ message: 'Veuillez télécharger les fichiers requis : CV, Certificat, CNI.' });
    }

    const cvPath = req.files.cv[0].path;
    const certificatePath = req.files.certificate[0].path;
    const cniPath = req.files.cni[0].path;

    const ref = `APP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    return res.status(200).json({
        message: 'Candidature reçue avec succès.',
        data: { fullName, email, phone, field, school, duration, startDate, endDate, motivation },
        files: { cv: cvPath, certificate: certificatePath, cni: cniPath },
        reference: ref
    });
});

// === Gestion globale des erreurs ===
app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Erreur d\'upload : ' + err.message });
    }
    res.status(500).json({ message: err.message || 'Erreur serveur.' });
});

// === Lancement du serveur ===
app.listen(PORT, () => {
    console.log(`✅ Serveur backend (Node.js) démarré sur http://localhost:${PORT}`);
});
