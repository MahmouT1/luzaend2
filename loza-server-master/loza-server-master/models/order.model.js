 import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userInfo: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
        default: "N/A",
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        required: false,
        default: "",
      },
    },
    shippingAddress: {
      type: Object,
      required: true,
    },

    orderItems: {
      type: Array,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Complete", "Canceled"],
      default: "Pending",
    },

    orderNumber: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: ["paid", "unpaid"],
        required: true,
      },
    },

    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },

    paidAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    // Points system fields
    pointsEarned: {
      type: Number,
      default: 0,
    },
    pointsUsed: {
      type: Number,
      default: 0,
    },
    pointsDiscount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Ensure only for new documents
    const maxValue = await this.constructor
      .findOne()
      .sort({ orderNumber: -1 })
      .select("orderNumber"); // Get current highest value
    this.orderNumber = maxValue ? maxValue.orderNumber + 1 : 1; // Handle initial value
  }
  next();
});

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.paymentMethod.status === "paid") {
      this.paidAt = Date.now();
    }
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
