const nodemailer = require('nodemailer');

let transporter;

async function initTransporter() {
    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            family: 4,
        });
        console.log('[Email Service] Production SMTP configured.');
    } else {
        console.log('[Email Service] No SMTP config found. Generating Ethereal test account...');
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
            family: 4,
        });
        console.log('[Email Service] Ethereal test account ready.');
    }
}

initTransporter().catch(console.error);

async function sendOTP(to, otp, purpose) {
    if (!transporter) {
        await initTransporter();
    }

    let subject = 'Your PortfolioOS Verification Code';
    let html = `<h1>Your OTP is: ${otp}</h1><p>It expires in 10 minutes.</p>`;

    if (purpose === 'register') {
        subject = 'Verify Your PortfolioOS Account';
    } else if (purpose === 'reset_pin') {
        subject = 'Reset Your PortfolioOS PIN';
        html = `<h1>Your Reset Code is: ${otp}</h1><p>If you didn't request this, ignore this email.</p>`;
    } else if (purpose === 'change_pin') {
        subject = 'Change Your PortfolioOS PIN';
        html = `<h1>Verification Code: ${otp}</h1><p>Use this code to authorize the PIN change.</p>`;
    } else if (purpose === 'erase_data') {
        subject = 'Data Erasure Request';
        html = `<h1>Verification Code: ${otp}</h1><p>Use this code to authorize the erasure of all your portfolio data.</p><p style="color:red">This action cannot be undone.</p>`;
    } else if (purpose === 'sensitive_action') {
        subject = 'Action Verification Required';
        html = `<h1>Verification Code: ${otp}</h1><p>Use this code to authorize the sensitive action.</p>`;
    } else if (purpose === 'change_email_old') {
        subject = 'Verify Current Email - PortfolioOS';
        html = `<h1>Verification Code: ${otp}</h1><p>Use this code to authorize changing your linked email address. This code is sent to your current email address.</p>`;
    } else if (purpose === 'change_email_new') {
        subject = 'Verify New Email - PortfolioOS';
        html = `<h1>Verification Code: ${otp}</h1><p>Use this code to verify and link this new email address to your PortfolioOS admin profile.</p>`;
    }

    try {
        let info = await transporter.sendMail({
            from: process.env.SMTP_USER ? `"PortfolioOS Admin" <${process.env.SMTP_USER}>` : '"PortfolioOS Admin" <admin@portfolioos.local>',
            to,
            subject,
            html,
        });

        console.log(`[Email Service] Sent OTP to ${to} for ${purpose}`);

        // If we are using Ethereal, log the preview URL to the console
        if (!process.env.SMTP_HOST) {
            console.log('[Email Service] 📧 View Email in Browser: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('[Email Service] Error sending email:', error);
        throw error;
    }
}

module.exports = { sendOTP };
