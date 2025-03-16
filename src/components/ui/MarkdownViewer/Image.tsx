import { useState } from "react";
import { ExpandedImage } from "../ExpandedImage";

type Props = {
  src: string | undefined;
  alt: string | undefined;
};

export const Image = ({ src, alt }: Props) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={
          "max-w-full max-h-100 rounded-lg shadow-md mx-auto border cursor-zoom-in transition-transform transform"
        }
        onClick={() => setExpand(true)}
      />
      <ExpandedImage
        expand={expand}
        src={src}
        alt={alt}
        onClick={() => setExpand(false)}
      />
    </>
  );
};
