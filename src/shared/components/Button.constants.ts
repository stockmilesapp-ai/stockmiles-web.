// Shape of the button. Constant objects rather than TypeScript enums: the
// project compiles with erasableSyntaxOnly, which does not allow enums.
// Either form works: variant={ButtonVariant.Outline} or variant="outline".
export const ButtonVariant = {
  Solid: "solid",
  Outline: "outline",
  Ghost: "ghost",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

// Colour roles from the theme (src/theme/theme.css).
export const ButtonColor = {
  Primary: "primary",
  Secondary: "secondary",
  Success: "success",
  Danger: "danger",
  Warning: "warning",
  Info: "info",
} as const;
export type ButtonColor = (typeof ButtonColor)[keyof typeof ButtonColor];
