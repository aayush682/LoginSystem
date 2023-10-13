const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


// Middleware function to authenticate user using JWT token
const authenticateUser = async (req, res, next) => {
    try {
        // Get JWT token from cookies
        const token = req.cookies.jwt;

        // Verify and decode JWT token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Find user based on decoded token's user ID
        const user = await User.findOne({ _id: decodedToken._id });

        // Attach token and user to request object for later use
        req.token = token;
        req.user = user;

        // Call next middleware function
        next();
    } catch (error) {
        // Redirect to login page if token is invalid or expired
        res.status(201).redirect('/login');
    }
}

module.exports = authenticateUser;