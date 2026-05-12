'use client';

import dynamic from 'next/dynamic';

const EBDApp = dynamic(() => import('@/components/ebd-app'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function Home() {
  return <EBDApp />;
}
