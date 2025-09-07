import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/products/get-products",
        method: "GET",
        credentials: "include",
      }),
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/get-single-product/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete-product/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useDeleteProductMutation,
} = productApi;
