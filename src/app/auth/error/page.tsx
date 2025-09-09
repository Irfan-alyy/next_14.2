
import { Suspense } from 'react';
import ErrorContent from './ErrorContent';

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}