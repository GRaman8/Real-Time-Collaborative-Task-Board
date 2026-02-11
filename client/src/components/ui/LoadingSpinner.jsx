export default function LoadingSpinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClass} rounded-full border-slate-200 border-t-sky-500 animate-spin`}
      />
    </div>
  );
}
