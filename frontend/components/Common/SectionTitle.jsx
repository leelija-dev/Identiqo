export default function SectionTitle({ title }) {
  return (
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] mb-4 relative inline-block animate-[fadeInDown_0.8s_ease-out]">
      
      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
        {title}
      </span>

      <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-20 md:w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
    </h2>
  );
}