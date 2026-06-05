// components/SectionTitle.jsx

export default function SectionTitle({
  title,
  subtitle,
  className = "",
}) {
  return (
    <h1
     className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight ${className}`}
    >
     <span
  className="
    bg-gradient-to-r
    from-blue-600
    via-purple-600
    to-pink-600
    bg-clip-text
    text-transparent
    animate-gradient-x
  "
>
  {title}
</span>

      {subtitle && (
        <>
          <br />
          <span className="text-gray-800">{subtitle}</span>
        </>
      )}
    </h1>
  );
}