require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Female', 'Male', 'Other'],
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});

// Generate a token
UserSchema.methods.generateAuthToken = async function () {
    try {
        // Create a token using the user's ID
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);

        // Add the token to the user's tokens array
        this.tokens = this.tokens.concat({ token });

        // Save the updated user
        await this.save();

        // Return the generated token
        return token;
    } catch (error) {
        console.log(error.message);
    }
}

/// Middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
    // Check if the password field has been modified or if it's a new user
    if (this.isModified('password') || this.isNew) {
        // Hash the password using bcrypt with a cost factor of 10
        this.password = await bcrypt.hash(this.password, 10);
    }
    // Call the next middleware or save the user
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;