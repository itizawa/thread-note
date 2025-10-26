export const urls = {
  top: "/",
  terms: "/terms",
  privacy: "/privacy",
  dashboard: "/dashboard",
  dashboardWithQuery: (page: number) => `/dashboard?page=${page}`,
  dashboardThreadNew: "/dashboard/new",
  dashboardThreadDetails: (id: string, postId?: string) =>
    `/dashboard/${id}${postId ? `?postId=${postId}` : ""}`,
  dashboardThreadDetailsExports: (id: string) => `/dashboard/${id}/exports`,
  dashboardSettings: (tab: "profile" | "files") =>
    `/dashboard/settings?tab=${tab}`,
  threadDetails: (id: string, postId?: string) =>
    `/${id}${postId ? `#${postId}` : ""}`,
  userDetails: (id: string) => `/users/${id}`,
};
