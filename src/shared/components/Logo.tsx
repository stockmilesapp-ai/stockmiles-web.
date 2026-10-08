function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo-mark.svg"
        alt=""
        className="size-8 shrink-0 transition-transform duration-300 hover:scale-105 sm:size-9"
      />
      <span className="font-script text-xl leading-none sm:text-2xl">
        <span className="text-brand-green-500">Stock</span>
        <span className="text-brand-lavender-500">Miles</span>
      </span>
    </span>
  );
}

export default Logo;
