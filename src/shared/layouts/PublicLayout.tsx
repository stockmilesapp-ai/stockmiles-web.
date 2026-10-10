import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import UserMenu from "@/features/auth/components/UserMenu";
import Container from "@/shared/components/Container";
import Logo from "@/shared/components/Logo";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#why-us", label: "Why us" },
];

const currentYear = new Date().getFullYear();

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

function PublicLayout() {
  const scrolled = useScrolled();

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-border bg-bg/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" aria-label="StockMiles home">
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <UserMenu showAdminLink />
            <div className="hidden sm:block">
              <GoogleSignInButton showMessages={false} />
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-10">
        <Container className="flex flex-col items-center justify-between gap-6 text-sm text-fg-muted sm:flex-row">
          <Logo />
          <Link to="/status" className="transition-colors hover:text-fg">
            System status
          </Link>
          <p>
            © {currentYear} StockMiles. Every mile. Every stock. Every sale.
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default PublicLayout;
