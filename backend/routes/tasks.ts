import express, { Response } from 'express';
import Task from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const router = express.Router();

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]),
    project: z.string()
});

const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["To Do", "In Progress", "Done"]).optional()
});

router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const tasks = await Task.find({ 
            project: req.params.projectId,
            owner: req.user?.userId // Ensure they only fetch tasks they own
        });
        res.json(tasks);
    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const validatedData = createTaskSchema.parse(req.body);
        
        const newTask = new Task({
            title: validatedData.title,
            description: validatedData.description,
            priority: validatedData.priority,
            project: validatedData.project,
            owner: req.user?.userId // Assign ownership
        });
        
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: (err as any).errors });
        }
        res.status(400).json({ message: "Error creating task", error: err.message });
    }
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const validatedData = updateTaskSchema.parse(req.body);
        
        // Find task and ensure user owns it
        const task = await Task.findOne({ _id: req.params.id, owner: req.user?.userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        if (validatedData.title) task.title = validatedData.title;
        if (validatedData.description !== undefined) task.description = validatedData.description;
        if (validatedData.priority) task.priority = validatedData.priority;
        if (validatedData.status) task.status = validatedData.status;
        task.updatedAt = new Date();
        const updatedTask = await task.save();
        
        res.json(updatedTask);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: (err as any).errors });
        }
        res.status(400).json({ message: "Error updating task", error: err.message });
    }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user?.userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        
        res.json({ message: "Task deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ message: "Error deleting task", error: err.message });
    }
});

export default router;
