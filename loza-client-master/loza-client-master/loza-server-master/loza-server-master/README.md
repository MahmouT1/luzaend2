# Loza E-commerce Platform

A full-stack e-commerce platform built with Node.js/Express backend and Next.js frontend with TypeScript.

## 🚀 Features

- **Backend (Express.js)**
  - RESTful API with JWT authentication
  - MongoDB database with Mongoose ODM
  - Product management with categories and sizes
  - Order management with invoice generation
  - User authentication and authorization
  - File upload with Cloudinary integration
  - PDF invoice generation

- **Frontend (Next.js with TypeScript)**
  - Modern React with TypeScript
  - Redux Toolkit for state management
  - Responsive design
  - Admin dashboard for product/order management
  - User authentication flow
  - Shopping cart functionality
  - Checkout process

## 📦 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for file storage
- PDFKit for invoice generation

### Frontend
- Next.js 15.4.6
- TypeScript
- Redux Toolkit
- Tailwind CSS
- React Hook Form

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd loza-server-master/loza-server-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../loza-client-master/loza-client-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Running Both Servers

You can run both backend and frontend servers simultaneously using:

```bash
# From the backend directory
npm run dev:both
```

This will start:
- Backend server on http://localhost:8000
- Frontend server on http://localhost:3000

## 📁 Project Structure

```
loza-server-master/
├── controllers/          # Route controllers
├── models/              # MongoDB models
├── routes/              # Express routes
├── middlewares/         # Custom middlewares
├── services/            # Business logic services
├── utils/               # Utility functions
└── server.js           # Main server file

loza-client-master/
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── redux/          # Redux store and slices
│   └── utils/          # Utility functions
└── public/             # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders/create-order` - Create order
- `GET /api/orders/get-orders` - Get all orders (admin)
- `PUT /api/orders/update-order-status/:id` - Update order status
- `GET /api/invoices/:orderId` - Download invoice

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.
