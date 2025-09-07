import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create-order",
        method: "POST",
        body: data,
        credentials: "include"
      }),
      invalidatesTags: ['Order']
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "/orders/get-orders",
        method: "GET",
        credentials: "include"
      })
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/update-order-status/${id}`,
        method: "PUT",
        body: { orderStatus: status },
        credentials: "include"
      })
    }),
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/orders/get-order/${id}`,
        method: "GET",
        credentials: "include"
      })
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/delete-order/${id}`,
        method: "DELETE",
        credentials: "include"
      })
    }),
    getInvoice: builder.query({
      query: (orderId) => ({
        url: `/orders/invoice/${orderId}`,
        method: "GET",
        credentials: "include",
        responseType: 'blob'
      })
    })
  })
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetSingleOrderQuery,
  useDeleteOrderMutation,
  useGetInvoiceQuery
} = orderApi;
