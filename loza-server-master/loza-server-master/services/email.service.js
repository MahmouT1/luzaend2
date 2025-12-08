import nodemailer from 'nodemailer';

// Create transporter using Hostinger Business Email SMTP
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');
  
  // Determine if we should use SSL (465) or TLS/STARTTLS (587)
  const useSSL = smtpPort === 465;
  const useSTARTTLS = smtpPort === 587;
  
  console.log('🔍 Creating Hostinger SMTP transporter:');
  console.log('SMTP Host:', smtpHost);
  console.log('SMTP Port:', smtpPort);
  console.log('Email User:', emailUser);
  console.log('Email Pass configured:', emailPass ? 'Yes (length: ' + emailPass.length + ')' : 'No');
  console.log('Connection Type:', useSSL ? 'SSL (Port 465)' : useSTARTTLS ? 'STARTTLS (Port 587)' : 'Custom');
  
  if (!emailPass) {
    const errorMsg = 'EMAIL_PASS environment variable is required for Hostinger SMTP. Please set it in your .env file.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }
  
  const transporterConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: useSSL, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
    debug: true, // Enable debug output
    logger: true // Enable logging
  };
  
  console.log('📧 Transporter configuration:');
  console.log('   - Host:', transporterConfig.host);
  console.log('   - Port:', transporterConfig.port);
  console.log('   - Secure (SSL):', transporterConfig.secure);
  console.log('   - STARTTLS:', useSTARTTLS ? 'Enabled' : 'Disabled');
  
  console.log('📧 Transporter configuration created successfully');
  return nodemailer.createTransport(transporterConfig);
};

// Order confirmation email template
const createOrderConfirmationEmail = (order, customerEmail) => {
  // Format shipping address
  const formatShippingAddress = (address) => {
    if (!address) return 'Not provided';
    if (typeof address === 'string') return address;
    
    const parts = [];
    if (address.address) parts.push(address.address);
    if (address.building) parts.push(`Building: ${address.building}`);
    if (address.unitNumber) parts.push(`Unit: ${address.unitNumber}`);
    if (address.city) parts.push(address.city);
    if (address.postalCode) parts.push(`Postal Code: ${address.postalCode}`);
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  const orderItems = (order.orderItems || []).map(item => {
    const productImage = item.coverImage || (item.images && (Array.isArray(item.images) ? (item.images[0]?.url || item.images[0]) : item.images.url)) || '';
    return `
      <tr>
        <td style="padding: 10px;">
          ${productImage ? `<img src="${productImage}" alt="${item.name || 'Product'}" class="product-image" />` : '<div class="product-image" style="background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px;">No Image</div>'}
        </td>
        <td style="padding: 10px;">
          <div class="product-name">${item.name || 'Product'}</div>
          <div class="product-details">Size: ${item.size || 'N/A'}</div>
        </td>
        <td style="padding: 10px;" class="product-quantity">${item.quantity || 1}</td>
        <td style="padding: 10px;" class="product-price">${item.price || 0} EGP</td>
      </tr>
    `;
  }).join('');

  // Calculate amounts safely
  const subtotal = order.subtotal || order.totalPrice || 0;
  // Only use deliveryFee if it's not the old value 85 (use new value 150 instead)
  let deliveryFee = order.deliveryFee || 0;
  // If deliveryFee is 85 (old value), treat it as 0 to hide it from email
  if (deliveryFee === 85) {
    deliveryFee = 0;
  }
  const pointsUsed = order.pointsUsed || 0;
  const totalPrice = order.totalPrice || order.finalAmount || subtotal;
  // totalPrice already includes deliveryFee, so don't add it again
  const totalPaid = totalPrice - pointsUsed;

  return {
    from: `"LUZA'S CULTURE" <${process.env.EMAIL_USER || 'orders@luzasculture.org'}>`,
    to: customerEmail,
    replyTo: process.env.EMAIL_USER || 'orders@luzasculture.org',
    subject: `Order Confirmation #${order.orderNumber} - LUZA'S CULTURE`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - LUZA'S CULTURE</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif; 
            line-height: 1.6; 
            color: #000000; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .email-wrapper { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 40px 30px 30px 30px; 
            text-align: center; 
            border-bottom: 2px solid #000000;
          }
          .logo { 
            max-width: 200px; 
            height: auto; 
            margin: 0 auto 20px auto; 
            display: block;
          }
          .brand-name {
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 2px;
            color: #000000;
            margin: 15px 0 0 0;
            text-transform: uppercase;
          }
          .success-badge {
            background-color: #000000;
            color: #ffffff;
            padding: 15px 30px;
            display: inline-block;
            margin: 25px 0 0 0;
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .content { 
            padding: 40px 30px; 
          }
          .greeting {
            font-size: 16px;
            color: #000000;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .section {
            margin-bottom: 30px;
            border: 1px solid #e5e5e5;
            padding: 25px;
            background-color: #ffffff;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #000000;
            padding-bottom: 10px;
          }
          .order-info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .order-info-row:last-child {
            border-bottom: none;
          }
          .order-info-label {
            font-weight: 500;
            color: #666666;
            font-size: 14px;
          }
          .order-info-value {
            font-weight: 600;
            color: #000000;
            font-size: 14px;
            text-align: right;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
          }
          .items-table th { 
            background-color: #000000; 
            color: #ffffff;
            padding: 12px 10px; 
            text-align: left; 
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .items-table td {
            padding: 15px 10px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border: 1px solid #e5e5e5;
          }
          .product-name {
            font-weight: 600;
            color: #000000;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .product-details {
            color: #666666;
            font-size: 12px;
          }
          .product-quantity, .product-price {
            font-size: 14px;
            color: #000000;
            font-weight: 500;
            text-align: center;
          }
          .total-section {
            background-color: #f9f9f9;
            border: 2px solid #000000;
            padding: 25px;
            margin-top: 30px;
          }
          .total-title {
            font-size: 14px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
          }
          .total-row.grand-total {
            border-top: 2px solid #000000;
            margin-top: 15px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: 600;
          }
          .total-label {
            color: #000000;
          }
          .total-value {
            color: #000000;
            font-weight: 600;
          }
          .shipping-info {
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            padding: 25px;
            margin-top: 20px;
          }
          .shipping-row {
            padding: 8px 0;
            font-size: 14px;
            color: #000000;
          }
          .points-section {
            background-color: #f9f9f9;
            border-left: 4px solid #000000;
            padding: 20px;
            margin: 25px 0;
          }
          .points-text {
            color: #000000;
            font-size: 14px;
            font-weight: 500;
          }
          .next-steps {
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #e5e5e5;
            margin-top: 30px;
          }
          .next-steps-text {
            color: #000000;
            font-size: 14px;
            line-height: 1.8;
          }
          .footer { 
            background-color: #000000; 
            color: #ffffff; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .footer-brand {
            font-size: 18px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-transform: uppercase;
          }
          .footer-text {
            font-size: 12px;
            color: #cccccc;
            line-height: 1.8;
            margin-bottom: 15px;
          }
          .footer-links {
            margin-top: 20px;
          }
          .footer-links a { 
            color: #ffffff; 
            text-decoration: none;
            font-size: 12px;
            margin: 0 15px;
            border-bottom: 1px solid #ffffff;
          }
          .footer-links a:hover {
            border-bottom: none;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { width: 100% !important; }
            .content { padding: 30px 20px !important; }
            .section { padding: 20px 15px !important; }
            .order-info-row { flex-direction: column; }
            .order-info-value { text-align: left; margin-top: 5px; }
            .items-table { font-size: 12px; }
            .items-table th, .items-table td { padding: 10px 5px; }
          }
        </style>
      </head>
      <body>
        <div style="background-color: #f5f5f5; padding: 20px 0;">
          <div class="email-wrapper">
            <!-- Header with Logo -->
            <div class="header">
              <img src="https://luzasculture.org/bann.png" alt="LUZA'S CULTURE" class="logo" />
              <div class="brand-name">LUZA'S CULTURE</div>
              <div class="success-badge">Order Confirmed</div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
              <div class="greeting">
                <p>Dear ${order.userInfo?.firstName || 'Valued Customer'},</p>
                <p style="margin-top: 15px;">Thank you for your purchase! We're delighted to confirm that your order has been received and is being processed with care.</p>
              </div>

              <!-- Order Details Section -->
              <div class="section">
                <div class="section-title">Order Details</div>
                <div class="order-info-row">
                  <span class="order-info-label">Order Number</span>
                  <span class="order-info-value">#${order.orderNumber}</span>
                </div>
                <div class="order-info-row">
                  <span class="order-info-label">Order Date</span>
                  <span class="order-info-value">${new Date(order.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div class="order-info-row">
                  <span class="order-info-label">Order Status</span>
                  <span class="order-info-value" style="color: #000000; text-transform: uppercase;">${order.orderStatus}</span>
                </div>
              </div>

              <!-- Items Ordered Section -->
              <div class="section">
                <div class="section-title">Items Ordered</div>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItems}
                  </tbody>
                </table>
              </div>

              <!-- Order Summary Section -->
              <div class="total-section">
                <div class="total-title">Order Summary</div>
                <div class="total-row">
                  <span class="total-label">Subtotal</span>
                  <span class="total-value">${subtotal} EGP</span>
                </div>
                ${deliveryFee > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Delivery Fee</span>
                    <span class="total-value">${deliveryFee} EGP</span>
                  </div>
                ` : ''}
                ${pointsUsed > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Points Used</span>
                    <span class="total-value">-${pointsUsed} points</span>
                  </div>
                ` : ''}
                <div class="total-row grand-total">
                  <span class="total-label">Total Paid</span>
                  <span class="total-value">${totalPaid} EGP</span>
                </div>
              </div>

              ${order.pointsEarned > 0 ? `
                <div class="points-section">
                  <div class="points-text">
                    You earned <strong>${order.pointsEarned} points</strong> with this purchase! Use these points for future discounts.
                  </div>
                </div>
              ` : ''}

              <!-- Shipping Information Section -->
              <div class="shipping-info">
                <div class="section-title">Shipping Information</div>
                <div class="shipping-row"><strong>Name:</strong> ${order.userInfo?.firstName || ''} ${order.userInfo?.lastName || ''}</div>
                <div class="shipping-row"><strong>Email:</strong> ${order.userInfo?.email || customerEmail}</div>
                <div class="shipping-row"><strong>Phone:</strong> ${order.userInfo?.phone || 'Not provided'}</div>
                <div class="shipping-row"><strong>Address:</strong> ${formatShippingAddress(order.shippingAddress)}</div>
              </div>

              <!-- Next Steps -->
              <div class="next-steps">
                <div class="next-steps-text">
                  <strong>What's Next?</strong><br>
                  We'll send you another email when your order ships. You can track your order status anytime by contacting us.
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-brand">LUZA'S CULTURE</div>
              <div class="footer-text">
                Thank you for choosing us! We appreciate your business.
              </div>
              <div class="footer-links">
                <a href="mailto:orders@luzasculture.org">Contact Support</a>
                <a href="https://luzasculture.org">Visit Our Store</a>
              </div>
              <div class="footer-text" style="margin-top: 25px; font-size: 11px; color: #999999;">
                This is an automated email from LUZA'S CULTURE. Please do not reply to this message.
              </div>
            </div>
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
    console.log('📧 Order number:', order?.orderNumber || 'N/A');
    
    // Validate email address
    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
      console.error('❌ Invalid customer email address:', customerEmail);
      return {
        success: false,
        message: 'Invalid customer email address. Cannot send confirmation email.',
        error: 'Invalid email format'
      };
    }
    
    // Validate order
    if (!order || !order.orderNumber) {
      console.error('❌ Invalid order data:', order);
      return {
        success: false,
        message: 'Invalid order data. Cannot send confirmation email.',
        error: 'Missing order information'
      };
    }

    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
    const emailPass = process.env.EMAIL_PASS;
    
    console.log('🔍 Hostinger Email credentials check:');
    console.log('EMAIL_USER from env:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS configured:', emailPass ? 'Yes' : 'No');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.hostinger.com');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '465');
    console.log('Using emailUser:', emailUser);
    
    if (!emailUser || !emailPass) {
      console.log('⚠️ Email credentials not configured.');
      console.log('📧 Email would be sent to:', customerEmail);
      console.log('📧 Order confirmation for Order #' + order.orderNumber);
      console.log('📝 Please configure EMAIL_USER and EMAIL_PASS environment variables for Hostinger SMTP');
      
      return {
        success: false,
        message: 'Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.',
        emailContent: 'Email would be sent but credentials not configured'
      };
    }

    // Try to send the email automatically
    try {
      console.log('📤 Attempting to create email transporter...');
      const transporter = createTransporter();
      
      console.log('📝 Creating email content...');
      const mailOptions = createOrderConfirmationEmail(order, customerEmail);
      
      console.log('📤 Sending email via Hostinger SMTP...');
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Order confirmation email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📧 Email sent to:', customerEmail);
      console.log('📧 From:', mailOptions.from);
      console.log('🎉 Customer will receive the email automatically!');
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Order confirmation email sent successfully to customer'
      };
    } catch (emailError) {
      console.error('❌ Error sending email:');
      console.error('Error message:', emailError.message);
      console.error('Error stack:', emailError.stack);
      console.error('Full error:', JSON.stringify(emailError, null, 2));
      console.log('📧 Email would be sent to:', customerEmail);
      console.log('📧 Order confirmation for Order #' + order.orderNumber);
      console.log('📝 Please check your Hostinger SMTP credentials:');
      console.log('   - EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
      console.log('   - EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET');
      console.log('   - SMTP_HOST:', process.env.SMTP_HOST || 'smtp.hostinger.com');
      console.log('   - SMTP_PORT:', process.env.SMTP_PORT || '465');
      
      return {
        success: false,
        error: emailError.message,
        message: 'Failed to send order confirmation email. Check server logs for details.'
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

// Store owner notification email template
const createStoreOwnerNotificationEmail = (order) => {
  // Format shipping address
  const formatShippingAddress = (address) => {
    if (!address) return 'Not provided';
    if (typeof address === 'string') return address;
    
    const parts = [];
    if (address.address) parts.push(address.address);
    if (address.street) parts.push(address.street);
    if (address.building) parts.push(`Building: ${address.building}`);
    if (address.unitNumber) parts.push(`Unit: ${address.unitNumber}`);
    if (address.city) parts.push(address.city);
    if (address.postalCode) parts.push(`Postal Code: ${address.postalCode}`);
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  // Format payment method
  const formatPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return 'Not specified';
    
    let methodText = paymentMethod.type || 'Unknown';
    
    // Convert common payment method formats
    if (methodText === 'Credit/Debit Card') methodText = 'Credit/Debit Card';
    if (methodText === 'Cash On Delivery') methodText = 'Cash On Delivery';
    if (methodText === 'cash_on_delivery') methodText = 'Cash On Delivery';
    if (methodText === 'instapay') methodText = 'Instapay';
    if (methodText === 'points_cash_on_delivery') methodText = 'Points + Cash On Delivery';
    
    let statusText = paymentMethod.status === 'paid' ? 'Paid' : 'Unpaid';
    
    let result = `${methodText} (${statusText})`;
    
    if (paymentMethod.instapayAccountName) {
      result += ` - Account: ${paymentMethod.instapayAccountName}`;
    }
    
    return result;
  };

  // Calculate amounts safely
  const subtotal = order.subtotal || order.totalPrice || 0;
  // Only use deliveryFee if it's not the old value 85 (use new value 150 instead)
  let deliveryFee = order.deliveryFee || 0;
  // If deliveryFee is 85 (old value), treat it as 0 to hide it from email
  if (deliveryFee === 85) {
    deliveryFee = 0;
  }
  const pointsUsed = order.pointsUsed || 0;
  const pointsDiscount = order.pointsDiscount || 0;
  const totalPrice = order.totalPrice || order.finalAmount || subtotal;
  // totalPrice already includes deliveryFee, so don't add it again
  const finalAmount = order.finalAmount || (totalPrice - pointsUsed);

  // Format order items
  const orderItemsList = (order.orderItems || []).map(item => {
    const productImage = item.coverImage || (item.images && (Array.isArray(item.images) ? (item.images[0]?.url || item.images[0]) : item.images.url)) || '';
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          ${productImage ? `<img src="${productImage}" alt="${item.name || 'Product'}" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid #e5e5e5;" />` : '<div style="width: 60px; height: 60px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px; border: 1px solid #e5e5e5;">No Image</div>'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          <div style="font-weight: 600; color: #000000; font-size: 14px; margin-bottom: 5px;">${item.name || 'Product'}</div>
          <div style="color: #666666; font-size: 12px;">Size: ${item.size || 'N/A'} | Quantity: ${item.quantity || 1}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600; color: #000000;">${item.price || 0} EGP</td>
      </tr>
    `;
  }).join('');

  // Format date and time
  const orderDate = new Date(order.createdAt || new Date());
  const formattedDate = orderDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Store owners emails list
  const storeOwnersEmails = [
    'Alysherif771@gmail.com',
    'Olaalqassas@gmail.com'
  ];

  return {
    from: `"LUZA'S CULTURE" <${process.env.EMAIL_USER || 'orders@luzasculture.org'}>`,
    to: storeOwnersEmails.join(', '), // Send to all store owners
    replyTo: process.env.EMAIL_USER || 'orders@luzasculture.org',
    subject: `🛍️ New Order #${order.orderNumber} - ${finalAmount} EGP`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification - LUZA'S CULTURE</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif; 
            line-height: 1.6; 
            color: #000000; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .email-wrapper { 
            max-width: 650px; 
            margin: 0 auto; 
            background-color: #ffffff; 
          }
          .header { 
            background-color: #000000; 
            padding: 40px 30px 30px 30px; 
            text-align: center; 
          }
          .logo { 
            max-width: 180px; 
            height: auto; 
            margin: 0 auto 20px auto; 
            display: block;
          }
          .brand-name {
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 2px;
            color: #ffffff;
            margin: 15px 0 0 0;
            text-transform: uppercase;
          }
          .notification-badge {
            background-color: #ffffff;
            color: #000000;
            padding: 12px 25px;
            display: inline-block;
            margin: 25px 0 0 0;
            font-size: 13px;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .content { 
            padding: 40px 30px; 
          }
          .alert-box {
            background-color: #fff4e6;
            border-left: 4px solid #ff9800;
            padding: 20px;
            margin-bottom: 30px;
          }
          .alert-text {
            font-size: 16px;
            font-weight: 600;
            color: #000000;
          }
          .section {
            margin-bottom: 25px;
            border: 1px solid #e5e5e5;
            padding: 25px;
            background-color: #ffffff;
          }
          .section-title {
            font-size: 15px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #000000;
            padding-bottom: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 500;
            color: #666666;
            font-size: 14px;
          }
          .info-value {
            font-weight: 600;
            color: #000000;
            font-size: 14px;
            text-align: right;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
          }
          .items-table th { 
            background-color: #000000; 
            color: #ffffff;
            padding: 12px 10px; 
            text-align: left; 
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .total-section {
            background-color: #f9f9f9;
            border: 2px solid #000000;
            padding: 25px;
            margin-top: 25px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
          }
          .total-row.grand-total {
            border-top: 2px solid #000000;
            margin-top: 15px;
            padding-top: 15px;
            font-size: 20px;
            font-weight: 600;
          }
          .total-label {
            color: #000000;
          }
          .total-value {
            color: #000000;
            font-weight: 600;
          }
          .customer-info {
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            padding: 25px;
            margin-top: 20px;
          }
          .customer-row {
            padding: 8px 0;
            font-size: 14px;
            color: #000000;
          }
          .footer { 
            background-color: #000000; 
            color: #ffffff; 
            padding: 30px; 
            text-align: center; 
          }
          .footer-brand {
            font-size: 16px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .footer-text {
            font-size: 12px;
            color: #cccccc;
            line-height: 1.8;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { width: 100% !important; }
            .content { padding: 30px 20px !important; }
            .section { padding: 20px 15px !important; }
            .info-row { flex-direction: column; }
            .info-value { text-align: left; margin-top: 5px; }
          }
        </style>
      </head>
      <body>
        <div style="background-color: #f5f5f5; padding: 20px 0;">
          <div class="email-wrapper">
            <!-- Header with Logo -->
            <div class="header">
              <img src="https://luzasculture.org/bann.png" alt="LUZA'S CULTURE" class="logo" style="filter: brightness(0) invert(1);" />
              <div class="brand-name">LUZA'S CULTURE</div>
              <div class="notification-badge">New Order Received</div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
              <div class="alert-box">
                <div class="alert-text">🛍️ You have received a new order!</div>
              </div>

              <!-- Order Details Section -->
              <div class="section">
                <div class="section-title">Order Information</div>
                <div class="info-row">
                  <span class="info-label">Order Number</span>
                  <span class="info-value">#${order.orderNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Date</span>
                  <span class="info-value">${formattedDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Time</span>
                  <span class="info-value">${formattedTime}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Status</span>
                  <span class="info-value" style="text-transform: uppercase;">${order.orderStatus || 'Pending'}</span>
                </div>
              </div>

              <!-- Items Ordered Section -->
              <div class="section">
                <div class="section-title">Order Items</div>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsList}
                  </tbody>
                </table>
              </div>

              <!-- Order Summary Section -->
              <div class="total-section">
                <div class="section-title" style="border-bottom: none; padding-bottom: 0; margin-bottom: 15px;">Order Summary</div>
                <div class="total-row">
                  <span class="total-label">Subtotal</span>
                  <span class="total-value">${subtotal} EGP</span>
                </div>
                ${deliveryFee > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Delivery Fee</span>
                    <span class="total-value">${deliveryFee} EGP</span>
                  </div>
                ` : ''}
                ${pointsDiscount > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Points Discount</span>
                    <span class="total-value">-${pointsDiscount} EGP</span>
                  </div>
                ` : ''}
                ${pointsUsed > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Points Used</span>
                    <span class="total-value">-${pointsUsed} points</span>
                  </div>
                ` : ''}
                <div class="total-row grand-total">
                  <span class="total-label">Total Amount</span>
                  <span class="total-value">${finalAmount} EGP</span>
                </div>
              </div>

              <!-- Payment Method Section -->
              <div class="section">
                <div class="section-title">Payment Information</div>
                <div class="info-row">
                  <span class="info-label">Payment Method</span>
                  <span class="info-value">${formatPaymentMethod(order.paymentMethod)}</span>
                </div>
              </div>

              <!-- Customer Information Section -->
              <div class="customer-info">
                <div class="section-title">Customer Information</div>
                <div class="customer-row"><strong>Name:</strong> ${order.userInfo?.firstName || ''} ${order.userInfo?.lastName || ''}</div>
                <div class="customer-row"><strong>Email:</strong> ${order.userInfo?.email || 'Not provided'}</div>
                <div class="customer-row"><strong>Phone:</strong> ${order.userInfo?.phone || 'Not provided'}</div>
                <div class="customer-row"><strong>Shipping Address:</strong></div>
                <div class="customer-row" style="padding-left: 20px; color: #666666; margin-top: 5px;">${formatShippingAddress(order.shippingAddress)}</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-brand">LUZA'S CULTURE</div>
              <div class="footer-text">
                This is an automated order notification email.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send store owner notification email
export const sendStoreOwnerNotificationEmail = async (order) => {
  try {
    // Store owners emails list
    const storeOwnersEmails = [
      'Alysherif771@gmail.com',
      'Olaalqassas@gmail.com'
    ];
    
    console.log('📧 Preparing to send store owner notification email...');
    console.log('📧 Owner emails:', storeOwnersEmails.join(', '));
    console.log('📧 Order number:', order?.orderNumber || 'N/A');
    
    // Validate order
    if (!order || !order.orderNumber) {
      console.error('❌ Invalid order data:', order);
      return {
        success: false,
        message: 'Invalid order data. Cannot send notification email.',
        error: 'Missing order information'
      };
    }

    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      console.log('⚠️ Email credentials not configured. Skipping store owner notification.');
      return {
        success: false,
        message: 'Email credentials not configured.',
        emailContent: 'Email would be sent but credentials not configured'
      };
    }

    try {
      console.log('📤 Creating email transporter for store owner notification...');
      const transporter = createTransporter();
      
      console.log('📝 Creating store owner notification email content...');
      const mailOptions = createStoreOwnerNotificationEmail(order);
      
      console.log('📤 Sending store owner notification email...');
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Store owner notification email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📧 Email sent to:', storeOwnersEmails.join(', '));
      
      return {
        success: true,
        messageId: result.messageId,
        message: `Store owner notification email sent successfully to ${storeOwnersEmails.length} owner(s)`
      };
    } catch (emailError) {
      console.error('❌ Error sending store owner notification email:');
      console.error('Error message:', emailError.message);
      console.error('Error stack:', emailError.stack);
      
      return {
        success: false,
        error: emailError.message,
        message: 'Failed to send store owner notification email. Check server logs for details.'
      };
    }
  } catch (error) {
    console.error('❌ Error in store owner email service:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to process store owner email request'
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
