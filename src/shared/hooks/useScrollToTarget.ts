import { useEffect } from "react";
import { sizeNumbers } from "../consts/size";

export const useScrollToTarget = () => {
  const handleScroll = (scrollId: string) => {
    const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - sizeNumbers.navigationHeight - 16, // Navigationに加えて余裕を持って16px開けている
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const scrollId = hash.substring(1); // `#section1` → `section1`
    handleScroll(scrollId);
  }, []);

  return { handleScroll };
};
