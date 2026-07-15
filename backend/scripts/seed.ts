import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Project from '../models/Project';
import Task from '../models/Task';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
    try {
        const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sprintforge-db';
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(dbURI);
        console.log('Connected.');

        // 1. Clear existing demo data (optional, but good for resetting)
        const demoEmail = 'recruiter@demo.com';
        await User.deleteOne({ email: demoEmail });
        
        // Note: In a real script we might delete all projects/tasks owned by this user,
        // but for simplicity, we'll just let them accumulate or assume a clean DB.

        // 2. Create Demo User
        console.log('Creating Demo User...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        const demoUser = new User({
            name: 'Demo Recruiter',
            email: demoEmail,
            password: hashedPassword
        });
        await demoUser.save();

        // 3. Create Demo Project
        console.log('Creating Demo Project...');
        const demoProject = new Project({
            name: 'Q3 Product Roadmap',
            description: 'Main sprint board for tracking upcoming features and bug fixes.',
            owner: demoUser._id
        });
        await demoProject.save();

        // 4. Create Demo Tasks
        console.log('Creating Demo Tasks...');
        const tasks = [
            {
                title: 'Design new landing page hero section',
                description: 'We need a higher converting hero section with a clear CTA.',
                status: 'Done',
                priority: 'High',
                project: demoProject._id,
                owner: demoUser._id
            },
            {
                title: 'Fix authentication CORS issue',
                description: 'Users are reporting inability to log in from Safari mobile.',
                status: 'Done',
                priority: 'High',
                project: demoProject._id,
                owner: demoUser._id
            },
            {
                title: 'Implement drag and drop for Kanban board',
                description: 'Swap native HTML5 for @hello-pangea/dnd for better a11y.',
                status: 'In Progress',
                priority: 'Medium',
                project: demoProject._id,
                owner: demoUser._id
            },
            {
                title: 'Write unit tests for User model',
                description: 'Ensure passwords are hashed before saving.',
                status: 'In Progress',
                priority: 'Low',
                project: demoProject._id,
                owner: demoUser._id
            },
            {
                title: 'Migrate backend to TypeScript',
                description: 'Add types and interfaces to Express routes and Mongoose models.',
                status: 'To Do',
                priority: 'Medium',
                project: demoProject._id,
                owner: demoUser._id
            },
            {
                title: 'Update README with deployment links',
                description: 'Make sure recruiters can easily find the live Vercel link.',
                status: 'To Do',
                priority: 'Low',
                project: demoProject._id,
                owner: demoUser._id
            }
        ];

        await Task.insertMany(tasks);
        
        console.log('✅ Database seeded successfully!');
        console.log(`Demo Login -> Email: ${demoEmail} | Password: password123`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
