import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - Not Found",
});
export default function Page() {
  return (
    <HydrateClient>
      <div className="min-h-screen p-5">
        <h3 className="mx-auto">Not Found</h3>
        <Link href={urls.top}>
          <a className="mx-auto">Go to Home</a>
        </Link>
      </div>
    </HydrateClient>
  );
}
