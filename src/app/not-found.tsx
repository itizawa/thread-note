import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <div className="min-h-screen p-5">
        <h3 className="mx-auto">Not Found</h3>
      </div>
    </HydrateClient>
  );
}
