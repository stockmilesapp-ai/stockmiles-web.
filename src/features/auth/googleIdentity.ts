// Thin wrapper around Google Identity Services (the "Sign in with Google"
// script). Google renders the button itself. In redirect mode the whole
// sign-in happens in the same window: the browser goes to Google, and Google
// posts the ID token to our API, which sets the session and returns to the app.

type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    ux_mode: "redirect";
    login_uri: string;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline";
      size: "large";
      shape: "pill";
      text: "signin_with";
    },
  ) => void;
  disableAutoSelect: () => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const SCRIPT_URL = "https://accounts.google.com/gsi/client";

// Must be registered under "Authorized redirect URIs" on the Google OAuth
// client, for every origin the app runs on.
const LOGIN_PATH = "/api/auth/google/callback";

export const googleClientId: string | undefined =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

let ready: Promise<GoogleAccountsId> | undefined;

// Loads Google's script and initialises it, once for the whole app.
export function loadGoogleIdentity(): Promise<GoogleAccountsId> {
  if (!googleClientId) {
    return Promise.reject(new Error("VITE_GOOGLE_CLIENT_ID is not set"));
  }
  const clientId = googleClientId;

  ready ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      const id = window.google?.accounts.id;
      if (!id) {
        reject(new Error("Google Identity Services did not load"));
        return;
      }
      id.initialize({
        client_id: clientId,
        ux_mode: "redirect",
        login_uri: `${window.location.origin}${LOGIN_PATH}`,
      });
      resolve(id);
    };
    script.onerror = () => {
      ready = undefined;
      reject(new Error("Could not load Google Identity Services"));
    };
    document.head.append(script);
  });

  return ready;
}

// Stops Google from silently re-selecting the same account after sign-out.
export function forgetGoogleSelection() {
  window.google?.accounts.id.disableAutoSelect();
}
