export const urls = {
  top: "/",
  terms: "/terms",
  dashboard: "/dashboard",
  dashboardWithQuery: (page: number) => `/dashboard?page=${page}`,
  dashboardThreadNew: "/dashboard/new",
  dashboardThreadDetails: (id: string) => `/dashboard/${id}`,
  dashboardSettings: (tab: "profile" | "files") =>
    `/dashboard/settings?tab=${tab}`,
  threadDetails: (id: string, postId?: string) =>
    `/${id}${postId ? `#${postId}` : ""}`,
  userDetails: (id: string) => `/users/${id}`,
};
