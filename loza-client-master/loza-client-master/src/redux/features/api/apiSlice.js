import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";
import { setUserId, clearUserId } from "../cart/cartSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders: (headers, { getState }) => {
      // Add any auth headers if needed
      return headers;
    },
  }),
  tagTypes: ['User', 'Order', 'Product'],
  keepUnusedDataFor: 60, // Default cache time for all endpoints

  endpoints: (builder) => ({
    // CHECKS IF USER IS LOGGED IN
    loadUser: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("🔐 LoadUser response:", result.data);
          console.log("🔐 User role from loadUser:", result.data.user?.role);
          
          // Check if there's fresh login data that shouldn't be overridden
          const freshUserData = localStorage.getItem('userData');
          if (freshUserData) {
            console.log("🔐 Skipping loadUser update - fresh login data exists");
            return;
          }
          
          dispatch(
            userLoggedIn({
              user: result.data.user,
            })
          );
          
          // Update cart with user ID
          if (result.data.user?._id) {
            dispatch(setUserId(result.data.user._id));
          }
        } catch (error) {
          console.log("🔐 LoadUser error - this is normal if not logged in:", error);
          // Don't log this as an error since it's expected when not authenticated
          // Clear cart user ID if user is not logged in
          dispatch(clearUserId());
        }
      },
      // Disable automatic refetching to prevent interference with login
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
  }),
});

export const { useLoadUserQuery } = apiSlice;
