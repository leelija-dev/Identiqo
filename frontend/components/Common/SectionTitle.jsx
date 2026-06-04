// components/SectionTitle.jsx

export default function SectionTitle({
  title,
  subtitle,
  className = "",
  gradient = true,
  centered = true,
}) {
  const TitleElement = gradient ? (
    <span className="bg-gradient-tertiary bg-clip-text text-transparent animate-gradient">
      {title}
    </span>
  ) : (
    <span className="text-slate-800">{title}</span>
  );

  return (
    <div className={`${centered ? 'text-center' : 'text-left'} ${className}`}>
      <h1 className="text-h1-md sm:text-h1-lg md:text-h1-xl font-bold leading-tight">
        {TitleElement}
        {subtitle && (
          <>
            <br />
            <span className="text-slate-600">{subtitle}</span>
          </>
        )}
      </h1>
    </div>
  );
}