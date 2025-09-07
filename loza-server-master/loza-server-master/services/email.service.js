import nodemailer from 'nodemailer';

// Create transporter (supports Gmail, Outlook, Yahoo)
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const emailUser = process.env.EMAIL_USER || 'mahmoudtarekrooa@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'sdfkiyxygrcweyjf';
  
  console.log('🔍 Creating transporter with:');
  console.log('Service:', service);
  console.log('User:', emailUser);
  console.log('Pass length:', emailPass ? emailPass.length : 'undefined');
  
  return nodemailer.createTransport({
    service: service,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Order confirmation email template
const createOrderConfirmationEmail = (order, customerEmail) => {
  const orderItems = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.coverImage || item.images?.[0]?.url}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">Size: ${item.size || 'N/A'}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} EGP</td>
    </tr>
  `).join('');

  return {
    from: process.env.EMAIL_USER || 'mahmoudtarekrooa@gmail.com',
    to: customerEmail,
    subject: `🎉 Order Confirmation - Order #${order.orderNumber} - Loza's Culture`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .congratulations { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
          .congratulations h2 { color: #d63031; margin: 0 0 10px 0; font-size: 24px; }
          .congratulations p { margin: 0; font-size: 16px; color: #2d3436; }
          .order-details { background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .order-details h3 { margin-top: 0; color: #2d3436; }
          .order-info { display: flex; justify-content: space-between; margin-bottom: 15px; }
          .order-info strong { color: #2d3436; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .items-table th { background-color: #e9ecef; padding: 12px; text-align: left; font-weight: bold; color: #2d3436; }
          .total-section { background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px; }
          .total-section h3 { margin-top: 0; color: #27ae60; }
          .shipping-info { background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px; }
          .shipping-info h3 { margin-top: 0; color: #1976d2; }
          .footer { background-color: #2d3436; color: white; padding: 20px; text-align: center; }
          .footer a { color: #74b9ff; text-decoration: none; }
          .points-earned { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
          .points-earned strong { color: #e84393; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your order has been confirmed</p>
          </div>
          
          <div class="content">
            <div class="congratulations">
              <h2>🎊 Thank You for Your Purchase!</h2>
              <p>We're thrilled to have you as our valued customer. Your order is being prepared with love and care!</p>
            </div>

            <div class="order-details">
              <h3>📋 Order Details</h3>
              <div class="order-info">
                <span><strong>Order Number:</strong></span>
                <span>#${order.orderNumber}</span>
              </div>
              <div class="order-info">
                <span><strong>Order Date:</strong></span>
                <span>${new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div class="order-info">
                <span><strong>Order Status:</strong></span>
                <span style="color: #27ae60; font-weight: bold;">${order.orderStatus}</span>
              </div>
            </div>

            <div class="order-details">
              <h3>🛍️ Items Ordered</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
              </table>
            </div>

            <div class="total-section">
              <h3>💰 Order Summary</h3>
              <div class="order-info">
                <span><strong>Subtotal:</strong></span>
                <span>${order.totalAmount} EGP</span>
              </div>
              <div class="order-info">
                <span><strong>Delivery Fee:</strong></span>
                <span>85 EGP</span>
              </div>
              ${order.pointsUsed > 0 ? `
                <div class="order-info">
                  <span><strong>Points Used:</strong></span>
                  <span>-${order.pointsUsed} points</span>
                </div>
              ` : ''}
              <div class="order-info" style="border-top: 2px solid #27ae60; padding-top: 10px; font-size: 18px;">
                <span><strong>Total Paid:</strong></span>
                <span><strong>${order.totalAmount + 85 - (order.pointsUsed || 0)} EGP</strong></span>
              </div>
            </div>

            ${order.pointsEarned > 0 ? `
              <div class="points-earned">
                <strong>🎁 You earned ${order.pointsEarned} points with this purchase!</strong>
                <p style="margin: 5px 0 0 0; color: #2d3436;">Use these points for future discounts!</p>
              </div>
            ` : ''}

            <div class="shipping-info">
              <h3>🚚 Shipping Information</h3>
              <div class="order-info">
                <span><strong>Name:</strong></span>
                <span>${order.userInfo.firstName} ${order.userInfo.lastName}</span>
              </div>
              <div class="order-info">
                <span><strong>Email:</strong></span>
                <span>${order.userInfo.email}</span>
              </div>
              <div class="order-info">
                <span><strong>Phone:</strong></span>
                <span>${order.userInfo.phone}</span>
              </div>
              <div class="order-info">
                <span><strong>Address:</strong></span>
                <span>${order.shippingAddress}</span>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; color: #2d3436;">
                <strong>🎯 What's Next?</strong><br>
                We'll send you another email when your order ships. 
                You can track your order status anytime by contacting us.
              </p>
            </div>
          </div>

          <div class="footer">
            <h3>Loza's Culture</h3>
            <p>Thank you for choosing us! We appreciate your business.</p>
            <p>
              <a href="mailto:support@lozasculture.com">Contact Support</a> | 
              <a href="http://localhost:3000">Visit Our Store</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px; color: #b2bec3;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    console.log('📧 Preparing to send order confirmation email...');
    console.log('📧 Customer email:', customerEmail);
    console.log('📧 Order number:', order.orderNumber);

    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER || 'mahmoudtarekrooa@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'sdfkiyxygrcweyjf';
    
    console.log('🔍 Email credentials check:');
    console.log('EMAIL_USER from env:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS from env:', process.env.EMAIL_PASS);
    console.log('Using emailUser:', emailUser);
    console.log('Using emailPass:', emailPass);
    
    if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com' || emailPass === 'your-app-password') {
      console.log('⚠️ Email credentials not configured.');
      console.log('📧 Email would be sent to:', customerEmail);
      console.log('📧 Order confirmation for Order #' + order.orderNumber);
      console.log('📝 To enable automatic email sending, run: node gmail-app-password-setup.js');
      
      return {
        success: false,
        message: 'Email credentials not configured. Run gmail-app-password-setup.js to configure.',
        emailContent: 'Email would be sent but credentials not configured'
      };
    }

    // Try to send the email automatically
    try {
      const transporter = createTransporter();
      const mailOptions = createOrderConfirmationEmail(order, customerEmail);
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Order confirmation email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📧 Email sent to:', customerEmail);
      console.log('🎉 Customer will receive the email automatically!');
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Order confirmation email sent successfully to customer'
      };
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError.message);
      console.log('📧 Email would be sent to:', customerEmail);
      console.log('📧 Order confirmation for Order #' + order.orderNumber);
      console.log('📝 To fix email issues, run: node gmail-app-password-setup.js');
      
      return {
        success: false,
        error: emailError.message,
        message: 'Failed to send order confirmation email'
      };
    }
  } catch (error) {
    console.error('❌ Error in email service:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to process email request'
    };
  }
};

// Test email functionality
export const testEmailService = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return false;
  }
};
