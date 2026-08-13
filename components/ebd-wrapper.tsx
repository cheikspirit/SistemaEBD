'use client';

import dynamic from 'next/dynamic';

const EBDApp = dynamic(() => import('@/components/ebd-app'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="font-mono text-sm animate-pulse">Carregando Plataforma EBD Digital...</p>
      </div>
    </div>
  ),
});

export default function EBDWrapper() {
  return <EBDApp />;
}
