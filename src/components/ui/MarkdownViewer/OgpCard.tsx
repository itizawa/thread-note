"use client";

import { trpc } from "@/trpc/client";

type Props = {
  url: string;
};

export const OgpCard = ({ url }: Props) => {
  const { data, isLoading } = trpc.ogp.fetchByUrl.useQuery({ url });

  if (isLoading) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border rounded-lg overflow-hidden hover:opacity-70 transition"
      >
        <div className="flex">
          <div className="p-4 flex-1 overflow-hidden space-y-1">
            <div className="w-full h-6 py-1">
              <div className="w-full h-4 bg-slate-300 animate-pulse rounded-sm" />
            </div>
            <div className="w-full overflow-hidden space-y-0.5">
              <div className="w-20 h-5 py-[3px]">
                <div className="w-20 h-3.5 bg-slate-300 animate-pulse rounded-sm" />
              </div>
              <div className="w-10 h-4 py-0.5">
                <div className="w-full h-3 bg-slate-300 animate-pulse rounded-sm" />
              </div>
            </div>
          </div>
          <div className="w-30 h-30 bg-slate-300 animate-pulse" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden hover:opacity-70 transition"
    >
      <div className="flex">
        <div className="p-4 flex-1 overflow-hidden space-y-1 flex flex-col">
          <p className="font-bold text-md text-gray-900 line-clamp-2">
            {data?.title}
          </p>
          <div className="w-full overflow-hidden space-y-0.5">
            <p className="text-sm text-gray-600 truncate">
              {data?.description}
            </p>
          </div>
          <div className="flex space-x-1 items-center mt-auto">
            {data?.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.favicon} alt="favicon" className="w-3 h-3" />
            )}
            <p className="text-xs text-gray-500 truncate">
              {new URL(url).hostname}
            </p>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data?.image || "/no-image.png"}
          alt={data?.title || url}
          className="w-32 h-32 object-cover"
        />
      </div>
    </a>
  );
};
