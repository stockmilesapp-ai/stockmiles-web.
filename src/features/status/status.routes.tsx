import type { RouteObject } from "react-router";
import StatusPage from "@/features/status/pages/StatusPage";

export const statusRoutes: RouteObject[] = [
  { path: "status", element: <StatusPage /> },
];
