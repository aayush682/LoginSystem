require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const route = require('./routes/route');
const cookieParser = require('cookie-parser');
require('./db/conn');

const PORT = process.env.PORT || 3000;

// Create express server
const server = express();

// Middleware
server.use(express.json()); // Parse JSON bodies
server.use(cookieParser()); // Parse cookies
server.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
server.use(route); // Use the route middleware

// Serve static files from the "public" directory
const publicPath = path.join(__dirname, "../public");
server.use(express.static(publicPath));

// Set up view engine and views directory
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, "../views/layouts"));
hbs.registerPartials(path.join(__dirname, "../views/partials"));

// Start the server
server.listen(PORT, () => {
    // Server is running
});