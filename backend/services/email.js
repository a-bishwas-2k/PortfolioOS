const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Verified domain in Resend - can now send to any recipient.
const FROM_ADDRESS = process.env.RESEND_FROM || 'PortfolioOS Admin <admin@mail.abhishekbishwas.com.np>';

async function sendOTP(to, otp, purpose) {
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
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('[Email Service] Resend error:', error);
            throw new Error(error.message || 'Failed to send email via Resend');
        }

        console.log(`[Email Service] Sent OTP to ${to} for ${purpose} (id: ${data?.id})`);
    } catch (error) {
        console.error('[Email Service] Error sending email:', error);
        throw error;
    }
}

module.exports = { sendOTP };