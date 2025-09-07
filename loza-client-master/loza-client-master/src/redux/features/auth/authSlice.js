import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      console.log("🔐 userLoggedIn called with:", action.payload);
      console.log("🔐 User role:", action.payload.user?.role);
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      console.log("🔐 userLoggedOut called");
      state.user = "";
    },
  },
});

export const { userLoggedOut, userLoggedIn } = authSlice.actions;

export default authSlice.reducer;
