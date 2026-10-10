import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/features/auth/auth.store";
import { landingPathFor } from "@/features/auth/landing";
import PageSpinner from "@/shared/components/PageSpinner";

// The page the browser returns to after Google sign-in. By the time it loads,
// the API has already handled Google's response and set the session cookie.
// This page shows a spinner while the app finds out who signed in, then sends
// them to the right place.
function AuthCallbackPage() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const failSignIn = useAuthStore((state) => state.failSignIn);
  const [searchParams] = useSearchParams();

  // Failed if the API said so, or if it reported success but this browser
  // ended up with no session (the cookie was not stored).
  const failed =
    searchParams.get("auth") === "failed" || status === "signedOut";

  useEffect(() => {
    if (failed) failSignIn();
  }, [failed, failSignIn]);

  if (failed) return <Navigate to="/" replace />;
  if (status === "signedIn" && user) {
    return <Navigate to={landingPathFor(user)} replace />;
  }
  return <PageSpinner label="Signing you in…" />;
}

export default AuthCallbackPage;
