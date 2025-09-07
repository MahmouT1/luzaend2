import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query({
      query: ({ startDate, endDate } = {}) => ({
        url: "/analytics/overview",
        method: "GET",
        credentials: "include",
        params: { startDate, endDate }
      })
    }),
    getSalesTrend: builder.query({
      query: (period = '7d') => ({
        url: "/analytics/sales-trend",
        method: "GET",
        credentials: "include",
        params: { period }
      })
    }),
    getTopProducts: builder.query({
      query: (limit = 10) => ({
        url: "/analytics/top-products",
        method: "GET",
        credentials: "include",
        params: { limit }
      })
    })
  })
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetSalesTrendQuery,
  useGetTopProductsQuery
} = analyticsApi;
