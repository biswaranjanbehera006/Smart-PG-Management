// import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// mock/Temparary ID 
const razorpay = {
  orders: {
    create: async (options) => ({
      id: "order_mock_123",
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
    }),
  },
};


// 🧾 Create Razorpay order
export const createOrder = async (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;
  try {
    const options = { amount: amount * 100, currency, receipt };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Verify and record payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, bookingId } = req.body;

    await Payment.create({
      bookingId,
      userId: req.user._id,
      amount: req.body.amount,
      gateway: "Razorpay",
      transactionId: razorpay_payment_id,
      status: "success",
    });

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "completed",
      bookingStatus: "confirmed",
    });

    res.json({ message: "Payment recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
