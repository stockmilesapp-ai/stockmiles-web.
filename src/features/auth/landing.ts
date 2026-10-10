import type { AuthUser } from "@/features/auth/auth.store";

// Where a user goes right after signing in. Everyone lands on the admin
// portal for now; once users have roles and businesses, decide here (for
// example onboarding for a new owner, billing for a cashier).
export function landingPathFor(_user: AuthUser): string {
  return "/admin";
}
