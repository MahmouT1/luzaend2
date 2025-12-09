import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Get cart items from localStorage based on user ID
const getCartItemsFromStorage = (userId = null) => {
  if (typeof localStorage === "undefined") return [];
  
  try {
    if (userId) {
      // Get user-specific cart
      const userCartKey = `cartItems_${userId}`;
      const cartItems = localStorage.getItem(userCartKey);
      return cartItems ? JSON.parse(cartItems) : [];
    } else {
      // Get guest cart (no user ID)
      const cartItems = localStorage.getItem("cartItems_guest");
      return cartItems ? JSON.parse(cartItems) : [];
    }
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    // Clear corrupted data
    if (userId) {
      localStorage.removeItem(`cartItems_${userId}`);
    } else {
      localStorage.removeItem("cartItems_guest");
    }
    return [];
  }
};

// Compress cart item to save only essential data
const compressCartItem = (item) => {
  // Get cover image URL
  const coverImageUrl = typeof item.coverImage === 'string' 
    ? item.coverImage 
    : (item.coverImage?.url || item.images?.[0]?.url || item.images?.[0] || '');
  
  // Get first image URL for cart display
  const firstImageUrl = item.images?.[0]?.url || item.images?.[0] || coverImageUrl;
  
  return {
    _id: item._id,
    name: item.name,
    price: item.price,
    coverImage: coverImageUrl,
    // Include images array with only first image for cart display
    images: firstImageUrl ? [{ url: firstImageUrl }] : [],
    size: item.size,
    quantity: item.quantity,
    points: item.points || 0,
    // Keep minimal info for stock checking
    info: item.info?.map(infoItem => ({
      size: infoItem.size,
      quantity: infoItem.quantity
    })) || []
  };
};

// Save cart items to localStorage based on user ID (with compression)
const saveCartItemsToStorage = (cartItems, userId = null) => {
  if (typeof localStorage === "undefined") return;
  
  try {
    // Compress cart items to reduce storage size
    const compressedItems = cartItems.map(compressCartItem);
    const cartData = JSON.stringify(compressedItems);
    
    // Check if data is too large (localStorage limit is usually 5-10MB)
    if (cartData.length > 4 * 1024 * 1024) { // 4MB warning
      console.warn("Cart data is getting large, consider clearing old items");
      toast.error("Cart is too large. Please remove some items.");
      return;
    }
    
    if (userId) {
      // Save user-specific cart
      const userCartKey = `cartItems_${userId}`;
      localStorage.setItem(userCartKey, cartData);
      // Clear guest cart when user logs in
      localStorage.removeItem("cartItems_guest");
    } else {
      // Save guest cart
      localStorage.setItem("cartItems_guest", cartData);
    }
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error("localStorage quota exceeded. Clearing old cart data...");
      toast.error("Cart storage full. Clearing old items...");
      // Try to clear and save again with only essential items
      try {
        if (userId) {
          const userCartKey = `cartItems_${userId}`;
          localStorage.removeItem(userCartKey);
          const compressedItems = cartItems.slice(-5).map(compressCartItem); // Keep only last 5 items
          localStorage.setItem(userCartKey, JSON.stringify(compressedItems));
        } else {
          localStorage.removeItem("cartItems_guest");
          const compressedItems = cartItems.slice(-5).map(compressCartItem); // Keep only last 5 items
          localStorage.setItem("cartItems_guest", JSON.stringify(compressedItems));
        }
        toast.success("Cart cleared. Please try again.");
      } catch (retryError) {
        console.error("Failed to save cart even after clearing:", retryError);
        toast.error("Unable to save cart. Please try again later.");
      }
    } else {
      console.error("Error saving cart to localStorage:", error);
      toast.error("Failed to save cart");
    }
  }
};

const initialState = {
  cartItems: getCartItemsFromStorage(),
  cartTotalQty: 0,
  cartTotalPrice: 0,
  cartTotalPriceAfterDiscount: 0,
  userId: null, // Track current user ID
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
        // Update points fields if they exist in the new product data (for backward compatibility)
        if (product.points !== undefined) {
          state.cartItems[existingProductIndex].points = product.points;
        }
        if (product.pointsCash !== undefined) {
          state.cartItems[existingProductIndex].pointsCash = product.pointsCash;
        }
        // Update price if discountPrice is available and valid
        const actualPrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) 
          ? product.discountPrice 
          : product.price;
        state.cartItems[existingProductIndex].price = actualPrice;
        // Store original price if not already stored
        if (!state.cartItems[existingProductIndex].originalPrice) {
          state.cartItems[existingProductIndex].originalPrice = product.price;
        }
      }
      // IF PRODUCT NOT IN CART
      else {
        // Calculate the actual price to use (discountPrice if available and valid, otherwise price)
        const actualPrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) 
          ? product.discountPrice 
          : product.price;
        
        // Ensure product has points fields, default to 0 if not present
        const newProduct = { 
          ...product, 
          price: actualPrice, // Use discounted price if available
          originalPrice: product.price, // Store original price for display
          quantity, 
          size,
          points: product.points || 0,
          pointsCash: product.pointsCash || 0
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

      saveCartItemsToStorage(state.cartItems, state.userId);
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;

      const updatedCartItems = state.cartItems.filter(
        (item) => !(item._id === productId && item.size === size)
      );
      state.cartItems = updatedCartItems;
      saveCartItemsToStorage(state.cartItems, state.userId);
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

      saveCartItemsToStorage(state.cartItems, state.userId);
    },
    decreaseProductQty: (state, action) => {
      const { product, size } = action.payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item._id === product._id && item.size === size
      );
      if (state.cartItems[productIndex].quantity > 1) {
        state.cartItems[productIndex].quantity -= 1;
        saveCartItemsToStorage(state.cartItems, state.userId);
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
      saveCartItemsToStorage(state.cartItems, state.userId);
    },
    // Set user ID and load their cart
    setUserId: (state, action) => {
      const newUserId = action.payload;
      const oldUserId = state.userId;
      
      // Save current cart before switching users
      if (oldUserId !== null) {
        saveCartItemsToStorage(state.cartItems, oldUserId);
      }
      
      // Update user ID
      state.userId = newUserId;
      
      // Load cart for new user
      state.cartItems = getCartItemsFromStorage(newUserId);
    },
    // Clear user ID (logout)
    clearUserId: (state) => {
      // Save current cart before clearing
      if (state.userId) {
        saveCartItemsToStorage(state.cartItems, state.userId);
      }
      
      state.userId = null;
      // Load guest cart
      state.cartItems = getCartItemsFromStorage(null);
    },
    // Update product data in cart (for refreshing product info like pointsCash)
    updateProductInCart: (state, action) => {
      const { productId, size, productData } = action.payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item._id === productId && item.size === size
      );
      
      if (productIndex !== -1) {
        // Update product data while preserving cart-specific fields
        state.cartItems[productIndex] = {
          ...state.cartItems[productIndex],
          ...productData,
          // Preserve cart-specific fields
          quantity: state.cartItems[productIndex].quantity,
          size: state.cartItems[productIndex].size,
          // Update points fields
          points: productData.points !== undefined ? productData.points : state.cartItems[productIndex].points,
          pointsCash: productData.pointsCash !== undefined ? productData.pointsCash : state.cartItems[productIndex].pointsCash,
        };
        saveCartItemsToStorage(state.cartItems, state.userId);
      }
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
  setUserId,
  clearUserId,
  updateProductInCart,
} = cartSlice.actions;

export default cartSlice.reducer;
