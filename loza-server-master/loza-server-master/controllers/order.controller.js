import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import PDFDocument from "pdfkit";
import { sendOrderConfirmationEmail } from "../services/email.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("📦 Order creation request received:", JSON.stringify(req.body, null, 2));
    const { userInfo, orderItems, paymentMethod } = req.body;
    
    // Validate required fields
    if (!userInfo || !orderItems || !paymentMethod) {
      console.log("❌ Validation failed - Missing fields:");
      console.log("  userInfo:", !!userInfo);
      console.log("  orderItems:", !!orderItems);
      console.log("  paymentMethod:", !!paymentMethod);
      return res.status(400).json({ 
        message: "Missing required fields: userInfo, orderItems, or paymentMethod" 
      });
    }

    if (!userInfo.userId) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ 
        message: "Order items must be a non-empty array" 
      });
    }
    
    // Calculate total price from order items if not provided
    let totalPrice = req.body.totalPrice;
    if (!totalPrice && orderItems) {
      totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Add delivery fee for cash on delivery and points + cash on delivery
    const DELIVERY_FEE = 85;
    if (paymentMethod && (paymentMethod.type === 'cash_on_delivery' || paymentMethod.type === 'points_cash_on_delivery')) {
      totalPrice += DELIVERY_FEE;
    }

    // create order with delivery fee information
    const orderData = {
      ...req.body,
      totalPrice,
    };

    // Add delivery fee to order data for reference
    if (paymentMethod && (paymentMethod.type === 'cash_on_delivery' || paymentMethod.type === 'points_cash_on_delivery')) {
      orderData.deliveryFee = DELIVERY_FEE;
      orderData.subtotal = totalPrice - DELIVERY_FEE;
    }

    // Generate order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1001;
    orderData.orderNumber = nextOrderNumber;

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
    
    let order;
    try {
      order = await Order.create(orderData);
      console.log("Order created successfully:", order._id);
    } catch (createError) {
      console.error("Order creation failed:", createError);
      console.error("Validation errors:", createError.errors);
      return res.status(400).json({ 
        message: "Order creation failed", 
        error: createError.message,
        details: createError.errors 
      });
    }

    // Update user's points and purchased products
      console.log("Finding user with ID:", userInfo.userId);
      const userRecord = await User.findById(userInfo.userId);
      if (userRecord) {
        console.log("User found:", userRecord.email);
        // Calculate points to earn from products
        let pointsToEarn = 0;
      if (req.body.pointsEarned !== undefined && req.body.pointsEarned !== null) {
          pointsToEarn = req.body.pointsEarned;
        } else {
        // Fallback calculation based on paymentMethod and item.points/pointsCash
        const paymentType = paymentMethod?.type || "";
          pointsToEarn = orderItems.reduce((sum, item) => {
          if (paymentType === "cash_on_delivery" && item.pointsCash !== undefined) {
            return sum + ((item.pointsCash || 0) * item.quantity);
          } else {
            return sum + ((item.points || 0) * item.quantity);
          }
          }, 0);
        }

        // Handle points based on payment method
        if (req.body.pointsUsed && req.body.pointsUsed > 0) {
          // Using points - deduct from account, no points earned
          if (userRecord.points < req.body.pointsUsed) {
            return res.status(400).json({ 
              message: "Insufficient points. You only have " + userRecord.points + " points available." 
            });
          }
          userRecord.points -= req.body.pointsUsed;
          console.log(`Deducted ${req.body.pointsUsed} points from user ${userRecord.email}`);
        } else {
          // Not using points - earn points from products
          userRecord.points += pointsToEarn;
          console.log(`Added ${pointsToEarn} points to user ${userRecord.email}`);
        }

        // Add purchased products
        orderItems.forEach(item => {
          userRecord.purchasedProducts.push({
            productId: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            purchasedAt: new Date()
          });
        });

        userRecord.totalPurchases += 1;
        await userRecord.save();
    }

    // If products were processed by quantityChecker, save them
    if (req.products && req.products.length > 0) {
      console.log(`💾 Saving ${req.products.length} products with updated stock...`);
      try {
        await Promise.all(req.products.map(async (product) => {
          await product.save();
          console.log(`✅ Stock updated for product: ${product.name}`);
        }));
        console.log(`✅ All product stock updates saved successfully`);
      } catch (error) {
        console.error("❌ Error saving product stock updates:", error);
        return res.status(500).json({ 
          message: "Error updating product stock", 
          error: error.message 
        });
      }
    } else {
      console.log("⚠️ No products to update stock for");
    }

    // Generate Invoice PDF in memory
        console.log("Starting PDF generation...");
        const pdfBuffer = await new Promise((resolve, reject) => {
          try {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          console.log("PDF generation completed successfully");
          resolve(Buffer.concat(buffers));
        });
        doc.on("error", (err) => {
          console.error("PDF generation error:", err);
          reject(err);
        });

        // PDF content
        doc.fontSize(20).text("Invoice", { align: "center" }).moveDown();
        doc.fontSize(12).text(`Invoice Number: ${order.orderNumber}`);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Order Status: ${order.orderStatus}`);
        doc
          .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
          .moveDown();

        doc.text("Customer Information:", { underline: true });
        doc.text(`${userInfo.firstName} ${userInfo.lastName}`);
        doc.text(userInfo.email);
        doc.text(userInfo.phone).moveDown();

        doc.text("Shipping Address:", { underline: true });
        doc.text(`${req.body.shippingAddress.address}`);
        doc
          .text(`${req.body.shippingAddress.city}, ${req.body.shippingAddress.postalCode}`)
          .moveDown();

        doc.text("Order Items:", { underline: true });
        req.body.orderItems.forEach((item, idx) => {
          doc.text(
            `${idx + 1}. ${item.name || 'Product'} | Size: ${item.size} | Qty: ${
              item.quantity
            } | Price: $${item.price}`
          );
        });
        doc.moveDown();

        // Add pricing breakdown
        doc.text(`Subtotal: $${order.subtotal}`);
        if (order.deliveryFee && order.deliveryFee > 0) {
          doc.text(`Delivery Fee: $${order.deliveryFee}`);
        }
        doc.moveDown();

        // Add points discount information if applicable
        if (order.pointsDiscount && order.pointsDiscount > 0) {
          doc.text(`Points Discount: -$${order.pointsDiscount.toFixed(2)}`);
          doc.moveDown();
        }

        doc.text(`Final Amount: $${order.finalAmount}`);
        doc.moveDown();

        doc.text(`Payment: ${req.body.paymentMethod.type} (${req.body.paymentMethod.status})`);
        
        // Add points summary if applicable
        if (order.pointsEarned || order.pointsUsed) {
          doc.moveDown();
          doc.text("Points Summary:", { underline: true });
          if (order.pointsEarned > 0) {
            doc.text(`Points Earned: ${order.pointsEarned}`);
          }
          if (order.pointsUsed > 0) {
            doc.text(`Points Used: ${order.pointsUsed}`);
          }
        }

            doc.end();
          } catch (pdfError) {
            console.error("PDF generation setup error:", pdfError);
            reject(pdfError);
          }
        });

    // Save Invoice to DB
        console.log("Creating invoice for order:", order._id);
        try {
          const invoice = await Invoice.create({
            orderId: order._id,
            userId: userInfo.userId,
            pdf: pdfBuffer,
          });
          console.log("Invoice created:", invoice._id);

          // Link invoiceId to order
          order.invoiceId = invoice._id;
          await order.save();
          console.log("Order updated with invoice ID");
        } catch (invoiceError) {
          console.error("Invoice creation error:", invoiceError);
          // Continue without invoice if it fails
          console.log("Continuing without invoice...");
        }

    // Track recent purchases for each product
        try {
          const { Product } = await import("../models/product.model.js");
          
          console.log("Starting recent purchases tracking...");
      console.log("Order items:", orderItems);
      console.log("User info:", userInfo);
      
      for (const item of orderItems) {
        console.log("Processing item:", item);
        console.log("Item productId:", item.productId);
        console.log("User nickname:", userInfo.nickname);
        
        if (item.productId && userInfo.nickname) {
          console.log("Adding purchase to product:", item.productId);
          
                // Get address from shipping address
                const address = req.body.shippingAddress ? 
                  `${req.body.shippingAddress.address || ''}, ${req.body.shippingAddress.city || ''}, ${req.body.shippingAddress.governorate || ''}`.trim().replace(/^,\s*|,\s*$/g, '') :
                  'Address not provided';
                
                const purchaseData = {
                  nickname: userInfo.nickname,
                  size: item.size || "One Size",
                  quantity: item.quantity,
                  purchaseDate: new Date(),
                  orderId: order._id,
                  orderNumber: order.orderNumber,
                  address: address
                };
                
          console.log("Purchase data:", purchaseData);
          
          const updatedProduct = await Product.findByIdAndUpdate(
            item.productId,
            {
              $push: {
                recentPurchases: purchaseData
              }
            },
            { new: true }
          );
          
          console.log("Product updated:", updatedProduct ? "Success" : "Failed");
          
          // Keep only the last 20 purchases per product to avoid bloating
                await Product.findByIdAndUpdate(
                  item.productId,
                  {
                    $push: {
                      recentPurchases: {
                  $each: [],
                        $slice: -20
                      }
                    }
                  }
                );
                
                console.log("Purchase tracking completed for product:", item.productId);
        } else {
          console.log("Skipping item - missing productId or nickname");
        }
              }
          console.log("Recent purchases tracked successfully");
        } catch (trackingError) {
          console.error("Error tracking recent purchases:", trackingError);
      // Don't fail the order if tracking fails
        }

    // Send order confirmation email
    try {
      console.log("📧 Sending order confirmation email...");
      const emailResult = await sendOrderConfirmationEmail(order, userInfo.email);
      if (emailResult.success) {
        console.log("✅ Order confirmation email sent successfully");
      } else {
        console.log("⚠️ Failed to send order confirmation email:", emailResult.message);
          }
        } catch (emailError) {
      console.error("❌ Error sending order confirmation email:", emailError);
      // Don't fail the order if email fails
    }

    const response = { 
      message: "Order created successfully", 
      orderId: order._id,
      invoiceId: order.invoiceId || null,
      orderNumber: order.orderNumber
    };
    console.log("Sending success response:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("Order creation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    console.log("Updating order status for ID:", id, "to status:", orderStatus);
    
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ 
      message: "Order status updated successfully", 
      order 
    });
  } catch (error) {
    console.log("order controller error (updateOrderStatus) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('invoiceId')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.log("order controller error (getAllOrders) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('invoiceId');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.log("order controller error (getOrderById) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Also delete associated invoice
    await Invoice.findOneAndDelete({ orderId: id });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log("order controller error (deleteOrder) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET INVOICE PDF
export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const invoice = await Invoice.findOne({ orderId });
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    res.send(invoice.pdf);
  } catch (error) {
    console.log("order controller error (getInvoice) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
