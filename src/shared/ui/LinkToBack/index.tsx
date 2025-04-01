"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type LinkToBackProps = {
  href: string;
  text: string;
};

export function LinkToBack({ href, text }: LinkToBackProps) {
  return (
    <Link
      href={href}
      className="flex space-x-1 items-center text-gray-700 hover:opacity-60 w-fit"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-xs">{text}</span>
    </Link>
  );
}
