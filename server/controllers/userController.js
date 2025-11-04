
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
async function register(req, res) {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
};

// Login Route
async function login(req, res) {
    const { username, password } = req.body;
    // const user = await User.findOne({ username });
    // if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = User.username === username && User.password === password;
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: User.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token });
};

module.exports = {
    register,
    login
}