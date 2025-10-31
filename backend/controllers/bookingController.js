import Booking from "../models/Booking.js";
import PG from "../models/PG.js";
import shortid from "shortid";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Safe __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧾 Create new booking
export const createBooking = async (req, res) => {
  try {
    const { pgId, checkIn, checkOut, totalAmount, tenantName, tenantContact } = req.body;

    // 🧩 Validation
    if (!tenantName || !tenantContact) {
      return res.status(400).json({ message: "Tenant name and contact are required." });
    }

    const pg = await PG.findById(pgId).populate("ownerId", "email name");
    if (!pg) return res.status(404).json({ message: "PG not found" });
    if (pg.availableRooms <= 0)
      return res.status(400).json({ message: "No rooms available" });

    // 🏠 Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      pgId,
      tenantName,
      tenantContact,
      checkIn,
      checkOut,
      totalAmount,
      bookingRef: `PG-${shortid.generate()}`,
    });

    // 🏘️ Update PG room count
    pg.availableRooms -= 1;
    await pg.save();

    // 🧾 Generate PDF invoice
    const invoicePath = await generateInvoicePDF(booking, pg, req.user.email);

    // 📧 Send email to tenant
    await sendBookingEmail(req.user.email, booking, pg, invoicePath, "tenant");

    // 📧 Send email to PG owner
    if (pg.ownerId?.email) {
      await sendBookingEmail(pg.ownerId.email, booking, pg, invoicePath, "owner");
    }

    // 🗑️ Delete the temporary invoice file after emails sent
    fs.unlink(invoicePath, (err) => {
      if (err) console.error("Error deleting invoice file:", err);
    });

    res.status(201).json({
      message: "Booking created successfully and confirmation emails sent.",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📜 Get user’s bookings
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("pgId");
  res.json(bookings);
};

// 📋 Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("pgId")
    .populate("userId", "name email");
  res.json(bookings);
};

// ❌ Cancel booking
export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (
    booking.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  booking.bookingStatus = "cancelled";
  await booking.save();

  const pg = await PG.findById(booking.pgId);
  if (pg) {
    pg.availableRooms += 1;
    await pg.save();
  }

  res.json({ message: "Booking cancelled successfully", booking });
};


// 📄 Download Invoice
export const downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("pgId")
      .populate("userId", "email name role");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🛡️ Authorization check
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this invoice" });
    }

    // 📄 Generate fresh PDF (not stored permanently)
    const invoicePath = await generateInvoicePDF(
      booking,
      booking.pgId,
      booking.userId.email
    );

    // 📤 Send file as download
    res.download(invoicePath, `Invoice_${booking.bookingRef}.pdf`, (err) => {
      if (err) console.error("Error sending invoice:", err);

      // 🧹 Clean up temp file
      fs.unlink(invoicePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting invoice:", unlinkErr);
      });
    });
  } catch (error) {
    console.error("❌ Invoice download error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//
// ✉️ Helper: Send Booking Emails with PDF Invoice
//
const sendBookingEmail = async (toEmail, booking, pg, invoicePath, role) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject =
    role === "tenant"
      ? `✅ Booking Confirmation: ${booking.bookingRef}`
      : `📩 New Booking Received: ${booking.bookingRef}`;

  const html =
    role === "tenant"
      ? `
      <h2>Booking Confirmation</h2>
      <p>Dear ${booking.tenantName},</p>
      <p>Your PG booking has been successfully created!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>PG Name:</strong> ${pg.name}</li>
        <li><strong>Address:</strong> ${pg.address}</li>
        <li><strong>Check-In:</strong> ${new Date(booking.checkIn).toDateString()}</li>
        <li><strong>Check-Out:</strong> ${new Date(booking.checkOut).toDateString()}</li>
        <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
        <li><strong>Booking Reference:</strong> ${booking.bookingRef}</li>
      </ul>
      <p>Please find the attached invoice for your booking.</p>
      <p>Thank you for choosing <b>Smart PG Management</b>!</p>
    `
      : `
      <h2>New Booking Received</h2>
      <p>Dear ${pg.ownerId?.name || "Owner"},</p>
      <p>You’ve received a new booking for your PG <b>${pg.name}</b>.</p>
      <ul>
        <li><strong>Tenant:</strong> ${booking.tenantName}</li>
        <li><strong>Contact:</strong> ${booking.tenantContact}</li>
        <li><strong>Check-In:</strong> ${new Date(booking.checkIn).toDateString()}</li>
        <li><strong>Check-Out:</strong> ${new Date(booking.checkOut).toDateString()}</li>
        <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
        <li><strong>Booking Reference:</strong> ${booking.bookingRef}</li>
      </ul>
      <p>The PDF invoice is attached for your records.</p>
      <p>– Smart PG Management</p>
    `;

  const mailOptions = {
    from: `"Smart PG Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
    attachments: [
      {
        filename: `Invoice_${booking.bookingRef}.pdf`,
        path: invoicePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

//
// 🧾 Helper: Generate PDF Invoice
//
const generateInvoicePDF = (booking, pg, email) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, `Invoice_${booking.bookingRef}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🏢 Header with styling
    doc
      .fontSize(22)
      .fillColor("#2C3E50")
      .text("SMART PG MANAGEMENT", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(14)
      .fillColor("#555")
      .text("Booking Invoice", { align: "center" });
    doc.moveDown(2);

    // 📋 Booking Info
    doc.fontSize(12).fillColor("#000");
    doc.text(`Booking Reference: ${booking.bookingRef}`);
    doc.text(`Tenant Name: ${booking.tenantName}`);
    doc.text(`Tenant Contact: ${booking.tenantContact}`);
    doc.text(`Tenant Email: ${email}`);
    doc.moveDown();

    doc.text(`PG Name: ${pg.name}`);
    doc.text(`Address: ${pg.address}`);
    doc.text(`City: ${pg.city || "-"}`);
    doc.moveDown();

    doc.text(`Check-In Date: ${new Date(booking.checkIn).toDateString()}`);
    doc.text(`Check-Out Date: ${new Date(booking.checkOut).toDateString()}`);
    doc.text(`Total Amount: ₹${booking.totalAmount}`);
    doc.moveDown(2);

    doc
      .fontSize(11)
      .fillColor("#555")
      .text("Thank you for booking with Smart PG Management!", { align: "center" });
    doc.moveDown(0.5);
    doc.text("This is a system-generated invoice.", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
