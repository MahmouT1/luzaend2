import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

let productsInCart = [];

if (typeof localStorage !== "undefined") {
  const cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    productsInCart = JSON.parse(cartItems);
  }
}

const initialState = {
  cartItems: productsInCart,
  cartTotalQty: 0,
  cartTotalPrice: 0,
  cartTotalPriceAfterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // DEFINE THE DATA WE WANT FIRST
      const { product, size, quantity } = action.payload;

      // Check stock availability
      const sizeInfo = product.info?.find((info) => info.size === size);
      if (!sizeInfo) {
        toast.error("Selected size not available");
        return;
      }

      if (sizeInfo.quantity <= 0) {
        toast.error("This size is out of stock");
        return;
      }

      // CHECK IF PRODUCT ALREADY IN CART
      const existingProductIndex = state.cartItems?.findIndex(
        (item) => item._id === product._id && item.size === size
      );

      let totalQuantity = quantity;
      if (existingProductIndex !== -1) {
        totalQuantity += state.cartItems[existingProductIndex].quantity;
      }

      // Check if total quantity exceeds stock
      if (totalQuantity > sizeInfo.quantity) {
        const available = sizeInfo.quantity - (existingProductIndex !== -1 ? state.cartItems[existingProductIndex].quantity : 0);
        if (available <= 0) {
          toast.error("This size is out of stock");
          return;
        } else {
          toast.error(`Only ${available} pieces available in this size`);
          return;
        }
      }

      // IF PRODUCT ALREADY IN CART
      if (existingProductIndex !== -1) {
        state.cartItems[existingProductIndex].quantity += quantity;
      }
      // IF PRODUCT NOT IN CART
      else {
        // Ensure product has points field, default to 0 if not present
        const newProduct = { 
          ...product, 
          quantity, 
          size,
          points: product.points || 0
        };
        state.cartItems.push(newProduct);
      }

      // Show low stock warning if applicable
      const remainingStock = sizeInfo.quantity - totalQuantity;
      if (remainingStock <= 2 && remainingStock > 0) {
        toast.error(`⚠️ Hurry! Only ${remainingStock} pieces left in stock for size ${size}`);
      } else if (remainingStock === 0) {
        toast.error(`⚠️ Last pieces added to cart for size ${size}`);
      } else {
        toast.success("ADDED TO CART");
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;

      const updatedCartItems = state.cartItems.filter(
        (item) => !(item._id === productId && item.size === size)
      );
      state.cartItems = updatedCartItems;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    increaseProductQty: (state, action) => {
      const { product, size } = action.payload;

      const productIndex = state.cartItems.findIndex(
        (item) => item._id === product._id && item.size === size
      );

      if (productIndex === -1) return;

      // Check stock availability
      const sizeInfo = product.info?.find((info) => info.size === size);
      if (!sizeInfo) {
        toast.error("Selected size not available");
        return;
      }

      const currentQuantity = state.cartItems[productIndex].quantity;
      if (currentQuantity >= sizeInfo.quantity) {
        toast.error(`Only ${sizeInfo.quantity} pieces available in this size`);
        return;
      }

      state.cartItems[productIndex].quantity += 1;
      
      // Show low stock warning
      const remainingStock = sizeInfo.quantity - (currentQuantity + 1);
      if (remainingStock <= 2 && remainingStock > 0) {
        toast.error(`⚠️ Hurry! Only ${remainingStock} pieces left in stock for size ${size}`);
      } else if (remainingStock === 0) {
        toast.error(`⚠️ Last pieces in cart for size ${size}`);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseProductQty: (state, action) => {
      const { product, size } = action.payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item._id === product._id && item.size === size
      );
      if (state.cartItems[productIndex].quantity > 1) {
        state.cartItems[productIndex].quantity -= 1;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    getTotals: (state, action) => {
      let total = 0;
      let quantity = 0;
      let discountTotal = 0;
      if (state.cartItems !== null) {
        state.cartItems.map((cartItem) => {
          total += cartItem.price * cartItem.quantity;
          quantity += cartItem.quantity;
          if (cartItem.discountPrice === 0) {
            discountTotal += cartItem.price * cartItem.quantity;
          } else {
            discountTotal += cartItem.discountPrice * cartItem.quantity;
          }
        });
      }

      const cartTotal = parseFloat(total.toFixed(2));
      state.cartTotalPrice = cartTotal;
      state.cartTotalQty = quantity;
      state.cartTotalPriceAfterDiscount = discountTotal;
    },
    clearAll: (state) => {
      state.cartItems = [];
      state.cartTotalQty = 0;
      state.cartTotalPrice = 0;
      state.cartTotalPriceAfterDiscount = 0;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  decreaseProductQty,
  increaseProductQty,
  removeFromCart,
  getTotals,
  clearAll,
} = cartSlice.actions;

export default cartSlice.reducer;
