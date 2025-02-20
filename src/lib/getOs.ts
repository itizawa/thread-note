export const getOs = () => {
  const userAgent = window.navigator.userAgent;
  if (userAgent.includes("Mac OS X")) {
    return "Mac";
  } else if (userAgent.includes("Windows")) {
    return "Windows";
  } else {
    return "Unknown";
  }
};

export const isMacOs = () => {
  return getOs() === "Mac";
};

export const isWindowsOs = () => {
  return getOs() === "Windows";
};
