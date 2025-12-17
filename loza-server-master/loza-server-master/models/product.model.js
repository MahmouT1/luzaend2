import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },

    images: { 
      type: Array, 
      required: true,
      validate: {
        validator: function(images) {
          return images && images.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    
    // Main cover image (first image in the array)
    coverImage: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    inStock: { type: Boolean },

    newArrival: { type: Boolean, default: true },

    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    pointsCash: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Scheduled Release Feature
    isScheduled: {
      type: Boolean,
      default: false,
    },
    releaseDate: {
      type: Date,
      default: null,
    },
    isReleased: {
      type: Boolean,
      default: true,
    },

    info: [
      {
        size: String,
        quantity: Number,
        inStock: {
          type: Boolean,
          default: function () {
            return this.quantity > 0;
          },
        },
      },
    ],

    // Track recent purchases for social proof
    recentPurchases: [
      {
        nickname: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        orderNumber: {
          type: Number,
          required: false,
        },
        address: {
          type: String,
          required: false,
        },
      },
    ],

    // Product ratings and reviews
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        userName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// For save
productSchema.pre("save", function (next) {
  if (this.info && Array.isArray(this.info)) {
    this.info.forEach((item) => {
      item.inStock = item.quantity > 0;
    });
    this.inStock = this.info.some((item) => item.inStock);
  }
  
  // Handle scheduled release logic
  if (this.isScheduled && this.releaseDate) {
    this.isReleased = new Date() >= new Date(this.releaseDate);
  } else if (!this.isScheduled) {
    this.isReleased = true;
  }
  
  next();
});

// For findOneAndUpdate / updateOne / updateMany
productSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    const update = this.getUpdate();
    
    if (update.info && Array.isArray(update.info)) {
      update.info = update.info.map((item) => ({
        ...item,
        inStock: item.quantity > 0,
      }));

      update.inStock = update.info.some((item) => item.inStock);
      this.setUpdate(update);
    }

    // Handle scheduled release logic for updates
    if (update.isScheduled && update.releaseDate) {
      update.isReleased = new Date() >= new Date(update.releaseDate);
    } else if (update.isScheduled === false) {
        update.isReleased = true;
    }

    next();
  }
);

// Post-find middleware to automatically check and update release status
productSchema.post(['find', 'findOne', 'findOneAndUpdate'], async function(docs) {
  if (!docs) return;
  
  const products = Array.isArray(docs) ? docs : [docs];
  const now = new Date();
  
  for (const product of products) {
    if (product && product.isScheduled && !product.isReleased && product.releaseDate) {
      if (now >= new Date(product.releaseDate)) {
        // Product should be released, update it
        await Product.findByIdAndUpdate(product._id, { isReleased: true });
        product.isReleased = true;
        console.log(`🔄 Auto-released product: ${product.name} (${product._id})`);
      }
    }
  }
});

export const Product = mongoose.model("Product", productSchema);
