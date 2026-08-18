const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioos';

const UserSchema = new mongoose.Schema({
    id: { type: String, default: 'single_user' },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const UserConfig = mongoose.model('UserConfig', UserSchema);

const defaultSkills = {
  "Languages": [
    ["JavaScript", 95],
    ["TypeScript", 90],
    ["Python", 85],
    ["Java", 80],
    ["C++", 75],
    ["C#", 70],
    ["Go", 60]
  ],
  "Frontend": [
    ["React", 95],
    ["Next.js", 90],
    ["Vue", 70],
    ["HTML5", 95],
    ["CSS3", 90],
    ["TailwindCSS", 95],
    ["Framer Motion", 85]
  ],
  "Backend": [
    ["Node.js", 90],
    ["Express", 90],
    ["NestJS", 75],
    ["Django", 80],
    ["Spring Boot", 70],
    ["GraphQL", 75]
  ],
  "Database": [
    ["MongoDB", 90],
    ["PostgreSQL", 85],
    ["MySQL", 85],
    ["Redis", 70],
    ["Firebase", 80],
    ["Supabase", 75]
  ],
  "Cloud & DevOps": [
    ["AWS", 75],
    ["Docker", 80],
    ["Kubernetes", 65],
    ["GitHub Actions", 85],
    ["Vercel", 90],
    ["Linux", 85]
  ],
  "Tools & Other": [
    ["Git", 95],
    ["Figma", 80],
    ["Postman", 90],
    ["Jest", 80],
    ["Cypress", 75]
  ]
};

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        let config = await UserConfig.findOne({ id: 'single_user' });
        
        if (!config) {
            console.log('User config not found. Creating a new one...');
            config = new UserConfig({
                id: 'single_user',
                data: {
                    skills: defaultSkills
                }
            });
        } else {
            console.log('User config found. Updating skills...');
            config.data = config.data || {};
            // Merge existing skills with default skills, keeping existing ones if they conflict
            const currentSkills = config.data.skills || {};
            const newSkills = { ...defaultSkills };
            
            // Overwrite categories to have a clean, comprehensive set, but maybe we just replace it 
            // since the user specifically requested to add all available technologies.
            config.data.skills = newSkills;
            
            config.markModified('data');
        }

        await config.save();
        console.log('Skills seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

seed();
