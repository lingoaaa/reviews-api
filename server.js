const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB
========================= */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const ReviewSchema = new mongoose.Schema({
    name: String,
    city: String,
    text: String,
    rating: Number,
    photos: Array,
    date: String
});

const Review = mongoose.model('Review', ReviewSchema);

/* =========================
   FILE UPLOAD
========================= */

const upload = multer({ dest: 'uploads/' });

app.use('/uploads', express.static('uploads'));

/* =========================
   GET REVIEWS
========================= */

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ _id: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   POST REVIEW
========================= */

app.post('/reviews', async (req, res) => {
    try {
        const review = new Review(req.body);

        await review.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   UPLOAD PHOTOS
========================= */

app.post('/upload', upload.array('photos', 3), (req, res) => {

    const files = req.files.map(f => ({
        url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`
    }));

    res.json({ files });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
