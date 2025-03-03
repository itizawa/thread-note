export const urls = {
  top: "/",
  terms: "/terms",
  dashboard: "/dashboard",
  dashboardWithQuery: (page: number) => `/dashboard?page=${page}`,
  dashboardThreadNew: "/dashboard/new",
  dashboardThreadDetails: (id: string) => `/dashboard/${id}`,
  dashboardSettings: "/dashboard/settings",
  threadDetails: (id: string) => `/${id}`,
};
