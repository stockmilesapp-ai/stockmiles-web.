import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  googleClientId,
  loadGoogleIdentity,
} from "@/features/auth/googleIdentity";

type GoogleSignInButtonProps = {
  // Hide messages where there is no room for them, such as the header.
  showMessages?: boolean;
  // Set when the button sits on a dark background, so messages stay readable.
  onDark?: boolean;
};

// Renders Google's own button while signed out, and nothing otherwise.
// Clicking it takes this window to Google and back; see googleIdentity.ts.
function GoogleSignInButton({
  showMessages = true,
  onDark = false,
}: GoogleSignInButtonProps) {
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (status !== "signedOut" || !googleClientId) return;

    let cancelled = false;
    loadGoogleIdentity()
      .then((google) => {
        if (cancelled || !buttonRef.current) return;
        google.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "signin_with",
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status !== "signedOut") return null;

  const message = !googleClientId
    ? "Google sign-in is not configured."
    : loadFailed
      ? "Google sign-in could not load. Check your connection and reload."
      : error;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Fixed height so the page does not jump when Google's button appears. */}
      <div ref={buttonRef} className="h-11" />
      {showMessages && message && (
        <p
          role="alert"
          className={`text-sm ${onDark ? "text-white/85" : "text-fg-muted"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
