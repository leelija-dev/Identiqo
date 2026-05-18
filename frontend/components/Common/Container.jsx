// components/common/Container.jsx

export default function Container({
  children,
  className = "",
}) {
  return (
    <div
      className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full ${className}`}
    >
      {children}
    </div>
  );
}