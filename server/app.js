const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Point to .env in root

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Define API routes
app.use('/api/users', require('./routes/auth'));
app.use('/api/blood-stock', require('./routes/bloodStock'));
// You'd add an /api/orders route here later for blood requests

// Wildcard route to serve index.html for any unmatched routes (for SPA routing)
app.get(/^(?!.*api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});