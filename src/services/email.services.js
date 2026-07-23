const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// module.exports = transporter;


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Backend Ledger";
    const text = `Hello ${name},\n\nThank you for registering with Backend Ledger. Your account is ready.\n\nBest regards,\nThe Backend Ledger Team`;

    const html = `
    <body style="margin:0;padding:0;background:#eeeeee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr><td align="center">

          <!-- Brand -->
          <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#1a1a2e;text-align:center;">Backend Ledger</p>

          <!-- Card -->
          <table align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e0e0e0;">
            <tr><td style="padding:32px 36px;">
              <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6;">Hello ${name},</p>
              <p style="margin:0;font-size:15px;color:#333;line-height:1.6;">Thank you for registering with Backend Ledger. Your account has been successfully created and is ready to use.</p>
            </td></tr>
          </table>

          <!-- Footer -->
          <p style="margin:24px 0 0;font-size:11px;color:#999;text-align:center;">&copy; ${new Date().getFullYear()} Backend Ledger. All rights reserved.</p>

        </td></tr>
      </table>
    </body>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendVerificationEmail(userEmail, name, tokenOrOtp) {
  const subject = "Verify Your Email - MoneyLens";
  const text = `Hello ${name},\n\nPlease use the following 6-digit OTP code to verify your email address:\n\n${tokenOrOtp}\n\nThis OTP will expire in 1 minute.\n\nBest regards,\nThe MoneyLens Team`;

  const html = `
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <p style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111827;text-align:center;">MoneyLens</p>
        <table align="center" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
          <tr><td style="padding:36px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1f2937;">Hello ${name},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.5;">Your 6-digit verification code is:</p>
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;font-family:monospace;font-size:28px;font-weight:800;text-align:center;letter-spacing:6px;color:#111827;">${tokenOrOtp}</div>
            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;text-align:center;">This OTP code is valid for <strong>1 minute</strong>. Do not share this code with anyone.</p>
          </td></tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">&copy; ${new Date().getFullYear()} MoneyLens. All rights reserved.</p>
      </td></tr>
    </table>
  </body>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendPasswordResetEmail(userEmail, name, tokenOrOtp) {
  const subject = "Password Reset OTP - MoneyLens";
  const text = `Hello ${name},\n\nYou requested a password reset. Your 6-digit OTP code is:\n\n${tokenOrOtp}\n\nThis OTP will expire in 1 minute.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe MoneyLens Team`;

  const html = `
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <p style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111827;text-align:center;">MoneyLens</p>
        <table align="center" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
          <tr><td style="padding:36px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1f2937;">Hello ${name},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.5;">You requested a password reset. Use the following 6-digit OTP code to reset your password:</p>
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;font-family:monospace;font-size:28px;font-weight:800;text-align:center;letter-spacing:6px;color:#ef4444;">${tokenOrOtp}</div>
            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;text-align:center;">This OTP code is valid for <strong>1 minute</strong>. If you did not request a password reset, please ignore this message.</p>
          </td></tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">&copy; ${new Date().getFullYear()} MoneyLens. All rights reserved.</p>
      </td></tr>
    </table>
  </body>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};