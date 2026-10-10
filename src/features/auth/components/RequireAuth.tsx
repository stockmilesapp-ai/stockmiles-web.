import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "@/features/auth/auth.store";
import PageSpinner from "@/shared/components/PageSpinner";

type RequireAuthProps = {
  children: ReactNode;
};

// Shows its children only to a signed-in user. Anyone else is sent to the
// public home page. This guards what the browser shows; the API still checks
// the session on every request.
function RequireAuth({ children }: RequireAuthProps) {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") return <PageSpinner label="Loading…" />;
  if (status === "signedOut") return <Navigate to="/" replace />;
  return children;
}

export default RequireAuth;
