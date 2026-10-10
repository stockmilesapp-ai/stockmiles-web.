import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import { useAuthStore } from "@/features/auth/auth.store";
import PageSpinner from "@/shared/components/PageSpinner";

function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser);
  const signingOut = useAuthStore((state) => state.signingOut);

  // Ask the API once, on start, whether this browser already has a session.
  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  return (
    <>
      <RouterProvider router={router} />
      {signingOut && <PageSpinner label="Signing you out…" />}
    </>
  );
}

export default App;
