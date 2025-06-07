"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = new user_model_1.default({
            username,
            email,
            password
        });
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).json({
            message: 'User registered successfully',
            token,
            userId: user._id,
            user: {
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }
        try {
            const user = await user_model_1.default.findOne({ email });
            if (!user) {
                res.status(401).json({ message: 'Invalid login credentials' });
                return;
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid login credentials' });
                return;
            }
            const token = user.generateAuthToken();
            res.json({
                message: 'Login successful',
                token,
                userId: user._id,
                user: {
                    username: user.username,
                    email: user.email
                }
            });
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid login credentials' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map