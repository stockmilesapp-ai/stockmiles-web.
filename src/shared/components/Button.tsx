import type { ComponentProps } from "react";
import { Link } from "react-router";
import {
  ButtonColor,
  ButtonVariant,
} from "@/shared/components/Button.constants";

type StyleProps = {
  // Defaults keep the original look: a neutral outlined pill.
  variant?: ButtonVariant;
  // Replaces the old HTML `color` attribute, which buttons do not use.
  color?: ButtonColor;
};

// One component, three elements. Each form takes every prop of the element it
// renders (aria-*, form, name, target, onMouseEnter, ref, …):
//   <Button onClick={save}>       → <button>, type="button" unless given
//   <Button to="/admin">          → router <Link>
//   <Button href="#features">     → <a>
type NativeButtonProps = StyleProps &
  Omit<ComponentProps<"button">, "color"> & { to?: undefined; href?: undefined };
type RouterLinkProps = StyleProps &
  Omit<ComponentProps<typeof Link>, "color"> & { href?: undefined };
type AnchorProps = StyleProps &
  Omit<ComponentProps<"a">, "color" | "href"> & {
    href: string;
    to?: undefined;
  };

export type ButtonProps = NativeButtonProps | RouterLinkProps | AnchorProps;

const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

// Written out in full so Tailwind can find every class in the source.
// Hover: filled buttons fade to 90%, the others get a 10% tint of their role.
const styles: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/70",
    success:
      "border-transparent bg-success text-success-foreground hover:bg-success/90",
    danger:
      "border-transparent bg-danger text-danger-foreground hover:bg-danger/90",
    warning:
      "border-transparent bg-warning text-warning-foreground hover:bg-warning/90",
    info: "border-transparent bg-info text-info-foreground hover:bg-info/90",
  },
  outline: {
    primary:
      "border-primary bg-transparent text-primary-strong hover:bg-primary/10",
    secondary:
      "border-border bg-transparent text-secondary-strong hover:bg-secondary-strong/5",
    success:
      "border-success bg-transparent text-success-strong hover:bg-success/10",
    danger:
      "border-danger bg-transparent text-danger-strong hover:bg-danger/10",
    warning:
      "border-warning bg-transparent text-warning-strong hover:bg-warning/10",
    info: "border-info bg-transparent text-info-strong hover:bg-info/10",
  },
  ghost: {
    primary:
      "border-transparent bg-transparent text-primary-strong hover:bg-primary/10",
    secondary:
      "border-transparent bg-transparent text-secondary-strong hover:bg-secondary-strong/5",
    success:
      "border-transparent bg-transparent text-success-strong hover:bg-success/10",
    danger:
      "border-transparent bg-transparent text-danger-strong hover:bg-danger/10",
    warning:
      "border-transparent bg-transparent text-warning-strong hover:bg-warning/10",
    info: "border-transparent bg-transparent text-info-strong hover:bg-info/10",
  },
};

function buttonClasses(
  variant: ButtonVariant = ButtonVariant.Outline,
  color: ButtonColor = ButtonColor.Secondary,
  className?: string,
) {
  return [base, styles[variant][color], className].filter(Boolean).join(" ");
}

function Button(props: ButtonProps) {
  if (props.to !== undefined) {
    const { variant, color, className, ...linkProps } = props;
    return (
      <Link {...linkProps} className={buttonClasses(variant, color, className)} />
    );
  }
  if (props.href !== undefined) {
    const { variant, color, className, ...anchorProps } = props;
    return (
      <a {...anchorProps} className={buttonClasses(variant, color, className)} />
    );
  }
  const {
    variant,
    color,
    className,
    type = "button",
    ...buttonProps
  } = props;
  return (
    <button
      type={type}
      {...buttonProps}
      className={buttonClasses(variant, color, className)}
    />
  );
}

export default Button;
