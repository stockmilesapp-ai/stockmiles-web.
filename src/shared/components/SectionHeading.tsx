type SectionHeadingProps = {
  title: string;
  description?: string;
};

function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-fg-muted">{description}</p>}
    </div>
  );
}

export default SectionHeading;
