'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white text-xl">Loading Game...</div>
    </div>
  ),
});

export default function GameClient() {
  return <Game />;
}