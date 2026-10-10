import type { RouteObject } from "react-router";
import AuthCallbackPage from "@/features/auth/pages/AuthCallbackPage";

export const authRoutes: RouteObject[] = [
  { path: "auth/callback", element: <AuthCallbackPage /> },
];
