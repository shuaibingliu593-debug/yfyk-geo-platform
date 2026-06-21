export function PatentsSectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="pat-heading">
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
