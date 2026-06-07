/**
 * Email service for password reset notifications
 * Uses nodemailer; falls back to console logging in development
 */
const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

const emailService = {
  /**
   * Send password reset email with secure token link (FR-003)
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'QuestLog <noreply@questlog.app>',
      to: email,
      subject: 'QuestLog - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">QuestLog Password Reset</h2>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">
            Reset Password
          </a>
          <p style="color: #666; margin-top: 20px;">This link expires in ${process.env.RESET_TOKEN_EXPIRES_HOURS || 1} hour(s).</p>
          <p style="color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const transport = getTransporter();
    if (transport) {
      await transport.sendMail(mailOptions);
    } else {
      console.log('[Email Dev Mode] Password reset link:', resetUrl);
    }
  },
};

module.exports = emailService;
