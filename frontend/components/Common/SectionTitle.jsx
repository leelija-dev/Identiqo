// components/Common/SectionTitle.jsx

export default function SectionTitle({
  badge,
  title,
  subtitle,
  description,
}) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      {badge && (
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
          <span className="text-indigo-600 text-sm font-semibold">
            {badge}
          </span>
        </div>
      )}

      <h2 className="text-slate-800 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
        {title}

        {subtitle && (
          <>
            {" "}
            <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text bg-[length:200%_auto] animate-gradient">
              {subtitle}
            </span>
          </>
        )}
      </h2>

      {description && (
        <p className="mt-5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}