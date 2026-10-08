import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  // Renders a link styled as a button when set.
  href?: string;
  onClick?: () => void;
};

const classes =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2";

function Button({ children, href, onClick }: ButtonProps) {
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
