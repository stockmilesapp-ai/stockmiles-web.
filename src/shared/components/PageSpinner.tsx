type PageSpinnerProps = {
  label: string;
};

// Covers the whole page while something that affects all of it is in progress.
function PageSpinner({ label }: PageSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-bg/90 backdrop-blur-sm"
    >
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-border border-t-brand-green-500"
      />
      <p className="text-sm font-medium text-fg-muted">{label}</p>
    </div>
  );
}

export default PageSpinner;
