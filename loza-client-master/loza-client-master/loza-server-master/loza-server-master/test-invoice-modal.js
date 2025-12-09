// Test script to verify invoice modal functionality
const testOrder = {
  _id: "test-order-123",
  orderNumber: 1001,
  userInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890"
  },
  shippingAddress: {
    address: "123 Main Street",
    city: "New York",
    postalCode: "10001",
    country: "USA",
    street: "Main Street",
    building: "123",
    unitNumber: "Apt 4B"
  },
  orderItems: [
    {
      name: "Test Product 1",
      size: "M",
      quantity: 2,
      price: 29.99
    },
    {
      name: "Test Product 2",
      size: "L",
      quantity: 1,
      price: 49.99
    }
  ],
  totalPrice: 109.97,
  orderStatus: "Complete",
  paymentMethod: {
    type: "Credit Card",
    status: "paid"
  },
  createdAt: new Date().toISOString(),
  invoiceId: "test-invoice-456"
};

console.log("Test Order Data:");
console.log("====================");
console.log("Order Information:");
console.log(`Order #: ${testOrder.orderNumber}`);
console.log(`Status: ${testOrder.orderStatus}`);
console.log(`Date: ${new Date(testOrder.createdAt).toLocaleDateString()}`);
console.log(`Total: $${testOrder.totalPrice.toFixed(2)}`);
console.log(`Payment Method: ${testOrder.paymentMethod.type}`);
console.log(`Payment Status: ${testOrder.paymentMethod.status}`);

console.log("\nCustomer Information:");
console.log(`Name: ${testOrder.userInfo.firstName} ${testOrder.userInfo.lastName}`);
console.log(`Email: ${testOrder.userInfo.email}`);
console.log(`Phone: ${testOrder.userInfo.phone}`);

console.log("\nShipping Address:");
console.log(`Address: ${testOrder.shippingAddress.address}`);
console.log(`City: ${testOrder.shippingAddress.city}`);
console.log(`Postal Code: ${testOrder.shippingAddress.postalCode}`);
console.log(`Country: ${testOrder.shippingAddress.country}`);
console.log(`Street: ${testOrder.shippingAddress.street}`);
console.log(`Building: ${testOrder.shippingAddress.building}`);
console.log(`Unit Number: ${testOrder.shippingAddress.unitNumber}`);

console.log("\nOrder Items:");
testOrder.orderItems.forEach((item, index) => {
  console.log(`${index + 1}. ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: $${item.price.toFixed(2)}`);
});

console.log("\nInvoice modal should display all this information correctly!");
