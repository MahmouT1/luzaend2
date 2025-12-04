import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/products/get-products",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 60, // Cache for 1 minute to ensure fresh stock data
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/get-single-product/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 60, // Cache for 1 minute to ensure fresh data
    }),
    getProductsByCategory: builder.query({
      query: (name) => ({
        url: `/products/get-products/${name}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, name) => [{ type: 'Product', id: `category-${name}` }, 'Product'],
      keepUnusedDataFor: 60, // Cache for 1 minute to ensure fresh stock data
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `/products/create-product`,
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/products/update-product/${id}`,
        method: "PUT",
        body: { data },
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product', // Invalidate all products list
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete-product/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ['Product'], // Invalidate products cache after deletion
    }),
    searchProducts: builder.query({
      query: (query) => ({
        url: `/products/search?q=${encodeURIComponent(query)}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getBestsellingProducts: builder.query({
      query: () => ({
        url: "/products/get-bestsellers",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    addProductRating: builder.mutation({
      query: ({ id, rating, review, userName, userId }) => ({
        url: `/products/add-rating/${id}`,
        method: "POST",
        body: { rating, review, userName, userId },
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product', // Invalidate all products list
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useAddProductRatingMutation,
  useGetBestsellingProductsQuery,
} = productApi;
