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
  threadDetails: ({
    userId,
    threadId,
    postId,
  }: {
    userId: string;
    threadId: string;
    postId?: string;
  }) => `/users/${userId}/${threadId}${postId ? `#${postId}` : ""}`,
  userDetails: (id: string) => `/users/${id}`,
};
