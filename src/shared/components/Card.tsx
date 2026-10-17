import type { ComponentProps } from "react";
import { X } from "lucide-react";

// A card built from parts, so each screen takes only what it needs:
//
//   <Card>
//     <CardHeader onClose={close}>
//       <CardTitle>Stores</CardTitle>
//       <CardDescription>Shops that belong to this business.</CardDescription>
//     </CardHeader>
//     <CardContent>…</CardContent>
//     <CardFooter>…</CardFooter>
//   </Card>
//
// Every part accepts the usual element props (className, id, aria-*, …).

function join(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={join(
        "flex flex-col rounded-2xl border border-border bg-surface text-fg shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

type CardHeaderProps = ComponentProps<"div"> & {
  // Shows a close button in the top right corner when set.
  onClose?: () => void;
  closeLabel?: string;
};

export function CardHeader({
  className,
  children,
  onClose,
  closeLabel = "Close",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={join("flex items-start gap-3 px-6 pt-5 pb-3", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="-mt-1 -mr-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={join(
        "font-display text-lg leading-snug font-semibold text-fg",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={join("text-sm text-fg-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={join("flex-1 px-6 py-3", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={join(
        "flex items-center justify-end gap-3 rounded-b-2xl border-t border-border bg-surface-2/50 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export default Card;
