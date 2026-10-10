import {
  Boxes,
  Building2,
  LayoutDashboard,
  Package,
  Receipt,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import UserMenu from "@/features/auth/components/UserMenu";
import Logo from "@/shared/components/Logo";

type NavItem = {
  label: string;
  icon: LucideIcon;
  // Items without a route are planned sections, shown but not yet clickable.
  to?: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Purchase trips", icon: Truck },
  { label: "Suppliers", icon: Building2 },
  { label: "Products", icon: Package },
  { label: "Stock", icon: Boxes },
  { label: "Sales", icon: Receipt },
];

const itemClasses =
  "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap";

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link to="/admin" aria-label="StockMiles admin home">
            <Logo />
          </Link>
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto border-b border-border bg-surface p-3 md:w-60 md:shrink-0 md:flex-col md:overflow-visible md:border-r md:border-b-0 md:p-4"
        >
          {navItems.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  `${itemClasses} ${
                    isActive
                      ? "bg-brand-green-500/10 text-brand-green-700"
                      : "text-fg hover:bg-surface-2"
                  }`
                }
              >
                <item.icon aria-hidden="true" className="size-5" />
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                aria-disabled="true"
                className={`${itemClasses} text-fg-muted`}
              >
                <item.icon aria-hidden="true" className="size-5" />
                {item.label}
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs md:ml-auto">
                  Soon
                </span>
              </span>
            ),
          )}
        </nav>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
