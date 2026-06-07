/**
 * Loading spinner component
 */
export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-quest-200 border-t-quest-600`} />
    </div>
  );
}
