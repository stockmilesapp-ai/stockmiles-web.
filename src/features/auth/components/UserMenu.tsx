import { useAuthStore } from "@/features/auth/auth.store";
import Button from "@/shared/components/Button";

type UserMenuProps = {
  // Show a link into the admin portal; used on the public pages.
  showAdminLink?: boolean;
};

// The signed-in user's name with a sign-out button. Renders nothing while
// signed out.
function UserMenu({ showAdminLink = false }: UserMenuProps) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-48 truncate text-sm font-medium text-fg sm:inline">
        {user.name || user.email}
      </span>
      {showAdminLink && <Button to="/admin">Admin portal</Button>}
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}

export default UserMenu;
