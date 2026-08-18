const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://abishwas2000_db_user:18UG8UQ5uzOppo5M@portfolioos.lyqvt8m.mongodb.net";

// Models
const UserSchema = new mongoose.Schema({
    mailId: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    accessPinHash: { type: String, required: true },
    accountType: { type: String, enum: ['admin', 'user'], default: 'user' },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const userConfigSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
});
const UserConfig = mongoose.model('UserConfig', userConfigSchema);

async function restore() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to DB');

        // 1. Find the admin user and get their access PIN hash
        const adminUser = await User.findOne({ accountType: 'admin' });
        let pinHash = "";
        if (adminUser) {
            pinHash = adminUser.accessPinHash;
            console.log(`Found admin user: ${adminUser.mailId} with display name: ${adminUser.displayName}`);
        } else {
            console.log("No admin user found! Generating a default PIN hash...");
            const bcrypt = require('bcryptjs');
            pinHash = await bcrypt.hash("2130", 10);
        }

        // 2. Define the template USER data (same as restore.js)
        const USER = {
            name: "ABHISHEK BISHWAS",
            role: "Data Analyst | Full-Stack Developer | CS Graduate",
            location: "Bhubaneswar, Odisha, India",
            email: "a.bishwas2000@gmail.com",
            phone: "(+91) 6287955039",
            resumeUrl: "#",
            bio: "B.Tech CS graduate from KIIT University (CGPA: 8.22/10), passionate about solving real-world problems through data analytics and technology. Starting my journey as a Data Analyst at Data Analytics Virtual Intern (via Forage), I love building things — from cloud-based coding IDEs to data dashboards. Open to opportunities in Data Analytics, Full-Stack Development, and Software Engineering.",
            skills: {
                "Languages": [["Python", 82], ["SQL", 80], ["HTML / CSS", 90], ["JavaScript", 85], ["C++", 70], ["Java", 68]],
                "Data & BI": [["Power BI", 78], ["Excel", 85], ["Exploratory Data Analysis", 80], ["Predictive Analytics", 72]],
                "Frontend": [["React.js", 78], ["Responsive Design", 85], ["CSS Animations", 82]],
                "Tools": [["GitHub", 80], ["VS Code", 90], ["Jupyter Notebook", 78], ["Linux", 75], ["MongoDB", 70]],
            },
            education: [
                {
                    degree: "B.Tech — Computer Science & Engineering",
                    school: "KIIT Deemed to be University, Bhubaneswar, Odisha",
                    year: "2021 – 2025", cgpa: "8.22 / 10", location: "Bhubaneswar, India",
                    logo: "", initials: "KIIT", link: ""
                },
                {
                    degree: "12th Grade — Science",
                    school: "Capital Secondary School, Kathmandu",
                    year: "YOP 2019", cgpa: "3.13 / 4.0", location: "Kathmandu, Nepal",
                    logo: "", initials: "CSS", link: ""
                },
                {
                    degree: "10th Grade",
                    school: "Bal Kalyan Vidhya Mandir Ma Vi, Biratnagar",
                    year: "YOP 2017", cgpa: "3.45 / 4.0", location: "Biratnagar, Nepal",
                    logo: "", initials: "BKV", link: ""
                }
            ],
            projects: [
                {
                    name: "KIIT LAB — Cloud Coders", slug: "kiitlab",
                    desc: "Cloud-based coding IDE built with HTML, CSS, JavaScript and ReactJS. Features teacher & student dashboards, Judge0 API for cloud code execution, and MongoDB for data storage.",
                    tags: ["React.js", "HTML", "CSS", "JavaScript", "MongoDB", "Judge0 API"],
                    emoji: "☁️", year: "2024",
                    status: "completed",
                    color: ["#7C3AED", "#22D3EE", "#4ADE80"],
                    glowColor: "258 89 73",
                    liveUrl: "#",
                    githubUrl: "https://github.com/a-bishwas-2k",
                    highlight: "Judge0 API · MongoDB · ReactJS",
                    thumbnail: ""
                },
                {
                    name: "To-Do List App", slug: "todolist",
                    desc: "Task management website with intuitive UI. Supports add, complete and delete tasks. Uses JavaScript and localStorage for persistent data across sessions.",
                    tags: ["HTML", "CSS", "JavaScript", "localStorage"],
                    emoji: "✅", year: "2024",
                    status: "completed",
                    color: ["#EC4899", "#A78BFA", "#22D3EE"],
                    glowColor: "322 89 68",
                    liveUrl: "#",
                    githubUrl: "https://github.com/a-bishwas-2k",
                    highlight: "Vanilla JS · localStorage",
                    thumbnail: ""
                },
                {
                    name: "Portfolio Website", slug: "portfolio",
                    desc: "Responsive personal portfolio website built with HTML, CSS and JavaScript. Compatible across devices and browsers, with interactive elements and smooth animations.",
                    tags: ["HTML", "CSS", "JavaScript"],
                    emoji: "🌐", year: "2023",
                    status: "completed",
                    color: ["#22D3EE", "#4ADE80", "#7C3AED"],
                    glowColor: "188 89 73",
                    liveUrl: "#",
                    githubUrl: "https://github.com/a-bishwas-2k",
                    highlight: "Responsive · Animated",
                    thumbnail: ""
                },
            ],
            links: {
                github: "https://github.com/a-bishwas-2k",
                linkedin: "https://www.linkedin.com/in/abhishek-9k96/",
                behance: "https://github.com/a-bishwas-2k",
                twitter: "https://twitter.com"
            },
            funFacts: [
                { title: "🏀 Basketball", text: "Led school basketball team as captain to win the Interschool Championship in 2017. Also played Inter-Hostel tournament at KIIT, securing runners-up in 2024." },
                { title: "🎓 Education", text: "B.Tech in CSE from KIIT University, Bhubaneswar with 8.22 CGPA. Previously studied in Kathmandu, Nepal and Biratnagar, Nepal." },
                { title: "🤖 GenAI", text: "Completed GenAI Powered Data Analytics Job Simulation by TATA IQ (via Forage) in Apr 2026. Also certified in IBM Data Science." },
                { title: "🌍 Languages", text: "Speaks English, Hindi, and Nepali fluently. Coding in Python, SQL and JavaScript is basically a fourth language at this point." },
                { title: "❤️ NGO Work", text: "Volunteered and taught underprivileged students at KISS (an NGO) in 2023 — because tech should uplift everyone." },
                { title: "📊 Data Nerd", text: "Currently working as a Data Analytics Virtual Intern (Forage). Obsessed with finding patterns in data and turning them into insight." },
            ],
            certs: [
                {
                    icon: '🤖', name: 'GenAI Powered Data Analytics Job Simulation',
                    issuer: 'TATA IQ · via Forage', date: 'Apr 2026',
                    tags: ['Generative AI', 'Data Analytics', 'EDA', 'Predictive Analytics'],
                    src: '#',
                    isImage: true
                },
                {
                    icon: '🎮', name: 'Cognite Game v4.5',
                    issuer: 'Perfectice', date: '2025',
                    tags: ['Problem Solving', 'Analytical Thinking'],
                    src: '#',
                    isImage: true
                },
                {
                    icon: '🔬', name: 'IBM Data Science Professional Certificate',
                    issuer: 'IBM · Coursera', date: '2024',
                    tags: ['Data Science', 'Python', 'Machine Learning', 'SQL'],
                    src: '#',
                    isImage: false
                },
            ],
            uptime: "8 years, 5 months (since first line of code)",
            contactLinks: [],
            gitLog: [
                ["2026-04-01", "cert: completed GenAI Powered Data Analytics Simulation — TATA IQ via Forage"],
                ["2025-05-01", "grad: B.Tech CSE from KIIT University — CGPA 8.22/10, shipped to the real world"],
                ["2024-11-01", "feat: shipped KIIT LAB Cloud Coders — Judge0 API + MongoDB + ReactJS"],
                ["2024-08-01", "feat: joined Data Analytics Virtual Internship via Forage"],
                ["2024-01-01", "feat: played Inter-Hostel Basketball at KIIT — secured runners-up 🏀"],
                ["2023-06-01", "volunteer: taught underprivileged students at KISS NGO — changed perspective"],
                ["2023-07-01", "feat: built responsive portfolio website — first real project shipped"],
                ["2017-03-01", "feat: captained school basketball team to Interschool Championship win 🏆"],
            ],
            admin_password_hash: pinHash
        };

        // Add certificates field inside USER
        USER.certificates = USER.certs || [];

        // 3. Upsert to the standard accounts
        const targetIds = ['single_user', 'bishwasabhi9596@gmail.com', 'a.bishwas2000@gmail.com'];
        for (const targetId of targetIds) {
            await UserConfig.findOneAndUpdate(
                { id: targetId },
                { data: USER },
                { upsert: true, new: true }
            );
            console.log(`Successfully restored data for: ${targetId}`);
        }

        // 4. Update the Admin User model fields to show correct displayName and avatar (if missing)
        if (adminUser) {
            adminUser.displayName = "ABHISHEK BISHWAS";
            await adminUser.save();
            console.log(`Updated User model displayName to "ABHISHEK BISHWAS" for admin user: ${adminUser.mailId}`);
        }

        console.log('DB Seed / Restore Completed successfully.');
        process.exit(0);
    } catch (e) {
        console.error("Error during restore:", e);
        process.exit(1);
    }
}
restore();
