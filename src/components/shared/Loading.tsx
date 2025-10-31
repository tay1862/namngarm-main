import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-pink-500 mx-auto mb-4" />
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-pink-500 mx-auto mb-4" />
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-pink-500" />;
}
