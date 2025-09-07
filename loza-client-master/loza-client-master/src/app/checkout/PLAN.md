# Checkout Page Enhancement Plan

## Information Gathered
- Current checkout page has basic form fields (fullName, email, phone, address, city, postalCode)
- Form uses React state management with useState
- Order submission uses Redux for API calls
- Current payment method is hardcoded to "Cash On Delivery"

## Plan

### 1. Form State Updates
- Add new fields to the form state:
  - country: string
  - street: string
  - building: string
  - unitNumber: string
  - paymentMethod: string (to track selected payment option)

### 2. UI Updates
- Add new form fields in the Checkout Details section:
  - Country (text input)
  - Street (text input)
  - Building (text input)
  - Unit Number (text input)

- Add payment method selection section with three options:
  - Credit/Debit Card (radio button with description)
  - Cash on Delivery (radio button with price details)
  - Points (dropdown with point values)

### 3. Validation Updates
- Update form validation to include new required fields
- Add validation for payment method selection

### 4. Order Data Updates
- Update shippingAddress object to include new address fields
- Update paymentMethod object to include selected payment type

### 5. Payment Option Details
- Credit/Debit Card: Add description text
- Cash on Delivery: Show order price, delivery price (85 EP), delivery time (3-5 days)
- Points: Dropdown with options 1000, 1700, 2000, 2500, 3000 points

## Dependent Files
- `src/app/checkout/page.tsx` (main file to be modified)

## Follow-up Steps
- Test form validation with new fields
- Test payment method selection
- Verify order submission includes all new data
- Test responsive design for new form layout
