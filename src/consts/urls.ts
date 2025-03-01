export const urls = {
  top: "/",
  dashboard: "/dashboard",
  dashboardWithQuery: (page: number) => `/dashboard?page=${page}`,
  dashboardThreadNew: "/dashboard/new",
  dashboardThreadDetails: (id: string) => `/dashboard/${id}`,
  dashboardSettings: "/dashboard/settings",
};
