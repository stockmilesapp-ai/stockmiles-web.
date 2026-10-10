import type { ReactNode } from "react";
import { Link } from "react-router";

type ButtonProps = {
  children: ReactNode;
  // Renders a plain link (for #anchors and external URLs) when set.
  href?: string;
  // Renders a client-side route link when set.
  to?: string;
  onClick?: () => void;
};

const classes =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2";

function Button({ children, href, to, onClick }: ButtonProps) {
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;
