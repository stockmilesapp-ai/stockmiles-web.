import { createBrowserRouter } from "react-router";
import { adminRoutes } from "@/features/admin/admin.routes";
import { authRoutes } from "@/features/auth/auth.routes";
import { homeRoutes } from "@/features/home/home.routes";
import { statusRoutes } from "@/features/status/status.routes";
import PublicLayout from "@/shared/layouts/PublicLayout";

// Each feature owns its routes; this file only decides which layout wraps them.
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [...homeRoutes, ...statusRoutes],
  },
  ...authRoutes,
  ...adminRoutes,
]);
