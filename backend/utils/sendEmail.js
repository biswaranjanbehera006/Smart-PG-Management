import nodemailer from "nodemailer";

/**
 * Sends an email using nodemailer with HTML and plain-text support.
 * Works for Gmail or any SMTP provider.
 * Requires EMAIL_USER and EMAIL_PASS in .env
 */

export async function sendEmail({ to, subject, text, html }) {
  try {
    // ✅ Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com", // Default Gmail
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for port 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email options
    const mailOptions = {
      from: `"Smart PG Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html
        ? `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
          <h2 style="color:#2C3E50;">Smart PG Management</h2>
          ${html}
          <br />
          <p style="font-size:13px; color:#777;">If you did not request this email, please ignore it.</p>
        </div>
      `
        : text,
    };

    // ✅ Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Email sending failed");
  }
}
