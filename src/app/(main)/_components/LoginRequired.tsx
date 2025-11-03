import { urls } from "@/shared/consts/urls";
import { trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

// 認証チェックを行うコンポーネント
export function LoginRequired({
  errorFallback,
  renderLoading,
  children,
}: {
  errorFallback: React.ReactNode;
  renderLoading: () => React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={renderLoading()}>
        <LoginRequiredCore>{children}</LoginRequiredCore>
      </Suspense>
    </ErrorBoundary>
  );
}

function LoginRequiredCore({ children }: { children: React.ReactNode }) {
  const currentUser = use(trpc.user.getCurrentUser());
  if (!currentUser) redirect(urls.top);

  return children;
}
