// components/common/Container.jsx

export default function Container({
  children,
  className = "",
  maxWidth = "7xl",
  padding = true,
}) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = padding ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div
      className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
}