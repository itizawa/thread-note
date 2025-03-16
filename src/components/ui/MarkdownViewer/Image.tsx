import { useState } from "react";

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
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-100 ${
          expand
            ? "opacity-100 pointer-events-auto cursor-zoom-out"
            : "opacity-0 pointer-events-none"
        } transition-opacity`}
        onClick={() => setExpand(false)}
      >
        <div className="absolute top-0 w-screen p-2">
          <span className="text-white text-sm font-bold">{alt}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-h-full max-w-full" />
      </div>
    </>
  );
};
