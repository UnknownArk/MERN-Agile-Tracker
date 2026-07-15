import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = registerSchema.parse(req.body);
        
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        const newUser = new User({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id }, 
            process.env.JWT_SECRET || 'fallback_secret_for_dev', 
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: (error as any).errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'fallback_secret_for_dev', 
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: (error as any).errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
