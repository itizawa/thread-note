"use client";

import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - Error",
});

export default function Page() {
  return (
    <div className="min-h-screen p-5">
      <h3 className="mx-auto">Error</h3>
      <Link href={urls.top} className="mx-auto">
        Go to Home
      </Link>
    </div>
  );
}
