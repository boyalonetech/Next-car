'use client';

import { Obstacle as ObstacleType } from '../types/game';

interface ObstacleProps {
  obstacle: ObstacleType;
}

export default function Obstacle({ obstacle }: ObstacleProps) {
  return (
    <div
      className="absolute bg-blue-500 rounded-md"
      style={{
        left: obstacle.position.x,
        top: obstacle.position.y,
        width: obstacle.width,
        height: obstacle.height,
        background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
        border: '2px solid #1e40af',
        borderRadius: '6px',
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
        💎
      </div>
    </div>
  );
}