const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

const router = express.Router();

/**
 * Route: GET /
 * Description: Renders the register page
 */
router.get("/", (req, res) => {
    res.render('register');
});

/**
 * Route: GET /index
 * Description: Renders the index page
 */
router.get("/index", (req, res) => {
    res.render('index');
});

/**
 * Route: GET /login
 * Description: Renders the login page
 */
router.get("/login", (req, res) => {
    res.render('login');
});

/**
 * Route: POST /register
 * Description: Handles the registration form submission
 */
router.post("/register", async (req, res) => {
    try {
        if (req.body.password === req.body.confirmpassword) {
            // Create a new user document
            const user = new User(req.body);

            // Generate a token for the user
            const token = await user.generateAuthToken();

            // Save the user document to the database
            await user.save();

            // Redirect to the login page
            res.redirect('/login');
        } else {
            // Send an error response if passwords do not match
            res.status(400).send("Passwords do not match");
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/register');
    }
});

/**
 * Route: POST /login
 * Description: Handles the login form submission
 */
router.post("/login", async (req, res) => {
    try {
        // Find the user in the database based on the provided email
        const user = await User.findOne({ email: req.body.email });


        if (user) {
            // Decrypt the user's password in the database and check if it matches the provided password
            const validPassword = await bcrypt.compare(req.body.password, user.password);

            // Generate a token for the user
            const token = await user.generateAuthToken();
            console.log(token);

            if (validPassword) {
                // Redirect the user to the index page if the password is valid
                res.redirect('/index');
            } else {
                // Send an error response if the password is invalid
                res.status(400).send("Incorrect password or email");
            }
        } else {
            // Send an error response if no user is found with the provided email
            res.status(400).send("User does not exist");
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/login');
    }
});

module.exports = router;