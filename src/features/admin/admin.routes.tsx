import type { RouteObject } from "react-router";
import DashboardPage from "@/features/admin/pages/DashboardPage";
import RequireAuth from "@/features/auth/components/RequireAuth";
import AdminLayout from "@/shared/layouts/AdminLayout";

// Everything under /admin needs a signed-in user and uses the admin layout.
export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
];
