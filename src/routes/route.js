const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/userSchema');

// Render the register page
router.get("/", (req, res) => {
    res.render('register');
});

// Render the index page, but only if the user is authenticated
router.get("/index", auth, (req, res) => {
    res.render('index');
});

// Render the login page
router.get("/login", (req, res) => {
    res.render('login');
});

// Logout the user by clearing tokens and the JWT cookie, then render the login page
router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
});

// Handle POST request to "/register" endpoint
router.post("/register", async (req, res) => {
    try {
        // Check if the password matches the confirm password
        if (req.body.password === req.body.confirmpassword) {
            // Create a new User object with the request body
            const user = new User(req.body);
            // Generate an authentication token for the user
            const token = await user.generateAuthToken();
            // Set a cookie named "jwt" with the generated token
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000), // Set the expiration date for the cookie
                httpOnly: true // Make the cookie accessible only through HTTP requests
            });
            // Save the user to the database
            await user.save();
            // Redirect the user to the login page
            res.redirect('/login');
        } else {
            // If the password does not match the confirm password, send a 400 Bad Request response
            res.status(400).send("Passwords do not match");
        }
    } catch (error) {
        // If an error occurs, log the error message to the console
        console.log(error.message);
        // Redirect the user to the register page
        res.redirect('/register');
    }
});

// Login the user
router.post("/login", async (req, res) => {
    try {
        // Find the user in the database based on the email provided in the request body
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // Compare the password provided in the request body with the hashed password stored in the user object
            const validPassword = await bcrypt.compare(req.body.password, user.password);

            // Generate an authentication token for the user
            const token = await user.generateAuthToken();

            // Set a cookie named "jwt" with the generated token
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 6000000),
                httpOnly: true,
            });

            if (validPassword) {
                // If the password is valid, redirect the user to the "/index" page
                res.redirect('/index');
            } else {
                // If the password is incorrect, send a 400 status code with an error message
                res.status(400).send("Incorrect password or email");
            }
        } else {
            // If the user does not exist, send a 400 status code with an error message
            res.status(400).send("User does not exist");
        }
    } catch (error) {
        // If an error occurs, log the error message and redirect the user to the "/login" page
        console.log(error.message);
        res.redirect('/login');
    }
});
module.exports = router;