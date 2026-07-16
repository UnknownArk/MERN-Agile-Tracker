import express, { Response } from 'express';
import Project from '../models/Project';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const router = express.Router();

const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional()
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const projects = await Project.find({ owner: req.user?.userId });
        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const validatedData = createProjectSchema.parse(req.body);
        
        const newProject = new Project({
            name: validatedData.name,
            description: validatedData.description,
            owner: req.user?.userId // Scope to logged-in user
        });
        
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: (err as any).errors });
        }
        res.status(400).json({ message: "Error creating project", error: err.message });
    }
});

export default router;