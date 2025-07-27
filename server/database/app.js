const express = require('express');
const mongoose = require('mongoose');
const Dealership = require('./dealership');
const Reviews = require('./review');
const Inventory = require('./inventory');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3030;

const uri = process.env.MONGODB_URI || 'mongodb://mongo_db:27017/test';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();

app.get('/fetchDealers', async (req, res) => {
    try {
        const dealerships = await Dealership.find();
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers' });
    }
});

app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const dealers = await Dealership.find({ st: req.params.state });
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers by state' });
    }
});

app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const dealer = await Dealership.findOne({ id: parseInt(req.params.id) });
        if (!dealer) {
            return res.status(404).json({ error: 'Dealer not found' });
        }
        res.json(dealer);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer' });
    }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const reviews = await Reviews.find({ dealership: parseInt(req.params.id) });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

app.post('/insert_review', express.json(), async (req, res) => {
    try {
        const documents = await Reviews.find().sort({ id: -1 });
        const new_id = documents.length > 0 ? documents[0].id + 1 : 1;
        const review = new Reviews({
            id: new_id,
            name: req.body.name,
            dealership: req.body.dealership,
            review: req.body.review,
            purchase: req.body.purchase,
            purchase_date: req.body.purchase_date,
            car_make: req.body.car_make,
            car_model: req.body.car_model,
            car_year: req.body.car_year,
        });
        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        res.status(500).json({ error: 'Error inserting review' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});