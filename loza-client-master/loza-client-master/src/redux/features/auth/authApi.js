import { signOut } from "next-auth/react";
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut } from "./authSlice";
import { setUserId, clearUserId } from "../cart/cartSlice";
import toast from "react-hot-toast";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //   REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data.user,
            })
          );
          
          // Update cart with user ID
          if (result.data.user?._id) {
            dispatch(setUserId(result.data.user._id));
          }
          
          toast.success("Account created successfully!");
        } catch (error) {
          console.log(error.message);
        }
      },
    }),

    //   LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          console.log("🔐 Login response:", result.data);
          console.log("🔐 User role from login:", result.data.user?.role);
          
          // Store the user data in localStorage to persist it
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          dispatch(
            userLoggedIn({
              user: result.data.user,
            })
          );
          
          // Update cart with user ID
          if (result.data.user?._id) {
            dispatch(setUserId(result.data.user._id));
          }
          
          // Prevent loadUser from overriding this data for a short time
          setTimeout(() => {
            localStorage.removeItem('userData');
          }, 5000);
          
        } catch (error) {
          console.error("Login error:", error);
          console.error("Login error details:", {
            message: error.message,
            status: error.status,
            data: error.data,
            originalStatus: error.originalStatus
          });
        }
      },
    }),

    //   SOCIAL AUTH - GOOGLE
    socialAuth: builder.mutation({
      query: ({ name, email }) => ({
        url: "/users/social-auth",
        method: "POST",
        body: { name, email },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // success => save user & set flag
          dispatch(
            userLoggedIn({
              user: result.data.user,
            })
          );
          
          // Update cart with user ID
          if (result.data.user?._id) {
            dispatch(setUserId(result.data.user._id));
          }
          
          localStorage.setItem("googleUserSynced", "true");
          toast.success("Logged In");
        } catch (error) {
          toast.error("Invalid credentials");
          signOut(); // logout from next-auth if failed
        }
      },
    }),

    //   LOGOUT
    logOut: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(userLoggedOut());
          
          // Clear cart user ID on logout
          dispatch(clearUserId());
        } catch (error) {}
      },
    }),

    // GET USER PROFILE
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          // Get current user state to preserve existing data
          const currentUser = getState().auth.user;
          
          // Update user data in auth state with profile information
          dispatch(
            userLoggedIn({
              user: {
                ...currentUser, // Preserve existing user data
                ...result.data.user, // Add/update with profile info
              }
            })
          );
        } catch (error) {
          // Completely silent - don't log anything for profile failures
          // This is expected behavior when not authenticated
        }
      },
      // Make this query completely non-blocking and silent
      retry: false,
      retryDelay: 0,
    }),

    // GET PURCHASED PRODUCTS
    getPurchasedProducts: builder.query({
      query: () => ({
        url: "/users/purchased-products",
        method: "GET",
        credentials: "include",
      }),
    }),

    // UPDATE USER POINTS
    updateUserPoints: builder.mutation({
      query: (points) => ({
        url: "/users/update-points",
        method: "PUT",
        body: { points },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Update points in local state
          dispatch(
            userLoggedIn({
              user: {
                points: result.data.user.points
              }
            })
          );
        } catch (error) {
          console.error("Failed to update points:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogOutMutation,
  useSocialAuthMutation,
  useGetUserProfileQuery,
  useGetPurchasedProductsQuery,
  useUpdateUserPointsMutation,
} = authApi;
