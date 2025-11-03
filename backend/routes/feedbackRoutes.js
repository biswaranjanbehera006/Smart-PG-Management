import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// 📬 POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { name, contact, rating, comment } = req.body;

    if (!name || !contact || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Configure your domain email SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., "smtp.yourdomain.com"
      port: 465, // or 587 if not SSL
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // your domain email
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    const mailOptions = {
      from: `"Smart PG Feedback" <${process.env.EMAIL_USER}>`,
      to: "rayrituparna78@gmail.com",
      subject: `🌟 New Feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9fb; padding: 20px;">
          <div style="max-width: 600px; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#4f46e5; text-align:center;">Smart PG Feedback Received</h2>
            <hr style="margin:20px 0; border:none; border-top:2px solid #eee;" />

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Rating:</strong> ⭐ ${rating}/5</p>
            <p><strong>Feedback:</strong></p>
            <blockquote style="background:#f3f4f6; padding:10px 15px; border-left:4px solid #4f46e5; margin:10px 0; color:#333;">
              ${comment}
            </blockquote>

            <p style="margin-top:20px; font-size:13px; color:#777;">This message was automatically sent from your Smart PG feedback system.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Error sending feedback email" });
  }
});

export default router;
