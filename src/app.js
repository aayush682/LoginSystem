require('dotenv').config()

// Import required modules
const express = require('express'); // Express web framework
const path = require('path'); // Path module for working with file and directory paths
const hbs = require('hbs'); // Handlebars templating engine
const route = require('./routes/route'); // User-defined router module


// Connect to the database
require('./db/conn');

const PORT = process.env.PORT || 3000; // Set the server port

// Create an instance of express
const app = express();

// Middleware: Parse JSON bodies
app.use(express.json());

// Middleware: Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Middleware: Use route for handling routes
app.use(route);

// Set the static directory path
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// Set the view engine to hbs (Handlebars)
app.set('view engine', 'hbs');

// Set the views directory path
app.set('views', path.join(__dirname, "../views/layouts"));

// Register partials path for hbs
hbs.registerPartials(path.join(__dirname, "../views/partials"));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});