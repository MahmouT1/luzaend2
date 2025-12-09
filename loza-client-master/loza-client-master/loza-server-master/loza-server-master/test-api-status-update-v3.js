import axios from 'axios';

async function testApiStatusUpdate() {
  try {
    console.log('Testing API order status update on port 8000...');
    
    // First, let's get an existing order to test with
    const ordersResponse = await axios.get('http://localhost:8000/api/orders/get-orders', {
      withCredentials: true
    });
    
    console.log('Orders response:', ordersResponse.data);
    
    if (ordersResponse.data.orders.length === 0) {
      console.log('No orders found to test with');
      return;
    }
    
    const testOrder = ordersResponse.data.orders[0];
    console.log('Testing with order:', testOrder._id, 'Current status:', testOrder.orderStatus);
    
    // Test updating status to Complete
    const newStatus = 'Complete';
    const updateResponse = await axios.put(
      `http://localhost:8000/api/orders/update-order-status/${testOrder._id}`,
      { status: newStatus },
      { withCredentials: true }
    );
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Verify the update
    const verifyResponse = await axios.get(`http://localhost:8000/api/orders/get-order/${testOrder._id}`, {
      withCredentials: true
    });
    
    console.log('✅ Verified status:', verifyResponse.data.order.orderStatus);
    
    if (verifyResponse.data.order.orderStatus === newStatus) {
      console.log('🎉 API order status update working correctly');
    } else {
      console.log('❌ API order status update failed');
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.response?.data || error.message);
    console.log('Error details:', error.response?.status, error.response?.statusText);
  }
}

testApiStatusUpdate();
