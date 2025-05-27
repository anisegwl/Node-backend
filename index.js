const express = require('express');
const dotenv = require("dotenv");
const connectDB = require('./db');

const app = express();

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware (optional, if you want to parse JSON in requests)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello Hero!');
});

app.get('/about', (req, res) => {
    res.send('This is About Pagee!');
});

app.get('/contact-us/address', (req, res) => {
    res.send('Kathmandu');
});

app.get('/testimonial', (req, res) => {
    res.send('This is Testimonial!');
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
