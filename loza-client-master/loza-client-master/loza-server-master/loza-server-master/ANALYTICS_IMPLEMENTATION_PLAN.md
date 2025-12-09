# Analytics Dashboard Implementation Plan

## Current State
- Frontend analytics page exists with static mock data
- Backend needs API endpoints for real analytics data
- Database has orders, products, and invoices collections

## Required Features
1. ✅ Number of orders
2. ✅ Total revenue
3. ✅ Total completed orders
4. ✅ Pending orders
5. ✅ Graph showing most popular products
6. ✅ Graph showing sales volume

## Backend Implementation

### API Endpoints Needed:
1. `GET /api/analytics/overview` - Returns overall statistics
2. `GET /api/analytics/sales-trend` - Returns sales data for charts
3. `GET /api/analytics/top-products` - Returns most popular products

### Data to Calculate:
- Total orders count
- Total revenue (sum of order.totalPrice where paymentMethod.status = "paid")
- Completed orders (orderStatus = "Complete")
- Pending orders (orderStatus = "Pending")
- Sales volume over time (group by date)
- Most popular products (from orderItems)

## Frontend Updates
- Connect existing analytics page to real API endpoints
- Add loading states and error handling
- Implement date range filtering
- Ensure proper data visualization

## Files to Modify
- Backend: Create analytics controller and routes
- Frontend: Update analytics page to fetch real data
- Frontend: Add analytics API slice to Redux

## Testing
- Test all API endpoints with various date ranges
- Verify data accuracy
- Test frontend integration
- Test error handling
