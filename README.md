

# 🏠 Smart PG Management System

![Project Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

> A full-featured **Smart PG (Paying Guest) Management System** built using the **MERN Stack**, enabling seamless management of tenants, rooms, payments, and admin control — all in one place.

---

## 🚀 Features

### 👤 User Module
- 🔐 **Register & Login** with email and OTP verification  
- 🏠 View available PG rooms and facilities  
- 📅 Book rooms and manage stay details  
- 💳 Online payment (future integration ready)  
- 📃 Generate and receive **booking invoices (PDF)** via email  
- 🧾 View booking and payment history  

### 🛠️ Admin Module
- 👨‍💼 Manage users and tenant data  
- 🏢 Add, edit, or remove PG rooms and facilities  
- 📊 View and control all bookings  
- 🚫 Block or unblock users  
- 📈 Dashboard with real-time stats  
- 💰 View monthly revenue and occupancy analytics  
- 📩 Receive automatic email notifications on new bookings  

### ☁️ Other Features
- 📧 OTP & Email Notifications using **Nodemailer**  
- ☁️ Image uploads via **Cloudinary**  
- 📑 PDF invoice generation via **PDFKit**  
- 🛡️ JWT-based Authentication  
- 📱 Fully responsive & modern UI (React + Tailwind CSS)  

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| 💻 Frontend | React.js, Axios, Tailwind CSS |
| 🖥 Backend | Node.js, Express.js |
| 🗄 Database | MongoDB with Mongoose |
| ☁️ Cloud | Cloudinary for file uploads |
| 📧 Email | Nodemailer with Gmail SMTP |
| 🧾 PDF | PDFKit for invoice generation |

---

## 🧩 Folder Structure

```
smart-pg-management/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/smart-pg-management.git
cd smart-pg-management
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

---

## 🧪 API Testing (Postman)

### 🔹 User Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### 🔹 Admin Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/block` | Block user |
| PUT | `/api/admin/users/:id/unblock` | Unblock user |
| GET | `/api/admin/bookings` | Get all bookings |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics/monthly-revenue` | Monthly revenue data |

---

## 📤 Email & PDF Features

- ✅ User receives **booking confirmation** & **PDF invoice** via email.  
- ✅ Admin receives **new booking alert** via email.  
- ✅ Invoice auto-generated using `PDFKit` & stored in `/temp` before sending.

---

## 🧠 Future Enhancements

- 💳 Integrate Razorpay / Stripe for secure online payments  
- 📱 Mobile app version using React Native  
- 🕒 Auto reminders for payment due dates  
- 📊 AI-based analytics for occupancy prediction  

---

## 🧑‍💻 Author

**Biswa Ranjan Behera**  
🚀 Full Stack Developer | MERN Enthusiast  
📧 [biswa.dev@example.com](mailto:biswa.dev@example.com)

---

## 🪪 License

This project is licensed under the **MIT License** — feel free to use and modify it.

