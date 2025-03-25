"use client";

export const getIsMobile = () => {
  if (typeof window === "undefined") return false;

  return window.innerWidth <= 640;
};
