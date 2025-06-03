"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = registerSchema.parse(req.body);
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.default({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email, username }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { username, email }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: 'Invalid input data' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { username: user.username, email: user.email }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: 'Invalid credentials' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map