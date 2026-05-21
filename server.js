const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const DB_FILE = 'reviews.json';

// GET REVIEWS
app.get('/reviews', (req, res) => {
    const data = fs.existsSync(DB_FILE)
        ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
        : [];
    res.json(data);
});

// POST REVIEW
app.post('/reviews', (req, res) => {
    const data = fs.existsSync(DB_FILE)
        ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
        : [];

    data.unshift(req.body);

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true });
});

// UPLOAD PHOTOS
app.post('/upload', upload.array('photos', 3), (req, res) => {
    const files = req.files.map(f => ({
        url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`
    }));

    res.json({ files });
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started'));