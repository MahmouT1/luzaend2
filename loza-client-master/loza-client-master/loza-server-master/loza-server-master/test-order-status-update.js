import axios from 'axios';

async function testOrderStatusUpdate() {
  const orderId = '68b0d17d317276866034f175'; // Use the order ID from the previous test
  const newStatus = 'Complete'; // Test status update

  try {
    // Test updating order status
    const updateResponse = await axios.put(`http://localhost:8000/api/orders/update-order-status/${orderId}`, {
      orderStatus: newStatus
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Order status updated successfully:', updateResponse.data);
  } catch (error) {
    console.log('❌ Order status update failed:', error.response?.status, error.response?.data);
  }
}

// Run the test
testOrderStatusUpdate();
