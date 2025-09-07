import axios from 'axios';

async function testOrderStatusUpdate() {
  const orderId = '68b0d17d317276866034f175'; // Use the order ID from the previous test
  const newStatus = 'Complete'; // Test status update
  const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFjYjc2MjY3ZWZhYTU4ZjAwMDJlMTciLCJpYXQiOjE3NTY0MTk1MjQsImV4cCI6MTc1OTAxMTUyNH0.ORmYNGNBQUlWbHyNmA2Dq_TfPKi4aWPmsKzfRy2K7uM';

  try {
    // Test updating order status
    const updateResponse = await axios.put(`http://localhost:8000/api/orders/update-order-status/${orderId}`, {
      orderStatus: newStatus
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    });

    console.log('✅ Order status updated successfully:', updateResponse.data);
  } catch (error) {
    console.log('❌ Order status update failed:', error.response?.status, error.response?.data);
  }
}

// Run the test
testOrderStatusUpdate();
