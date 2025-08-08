const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

router.get('/login', async (req, res) => {
    try {
        const token = req.cookies?.token;

        // 1️⃣ Try to login via token first
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.userId).select('-password');
                
                if (user) {
                    return res.status(200).json({
                        message: 'Logged in with existing token',
                        user
                    });
                }
            } catch (err) {
                console.log("Unauthorized token / Token not available");
                
            }
        }

        // 2️⃣ Try to login via email + password if provided
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: 'Unauthorized: No valid token or credentials' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a new token
        const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            message: 'Logged in with credentials',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
