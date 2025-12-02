'use client';

import { Car as CarType } from '../types/game';

interface CarProps {
  car: CarType;
}

export default function Car({ car }: CarProps) {
  return (
    <div
      className="absolute bg-red-500 rounded-lg"
      style={{
        left: car.position.x,
        top: car.position.y,
        width: car.width,
        height: car.height,
        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
        border: '2px solid #991b1b',
        borderRadius: '10px 10px 4px 4px',
      }}
    >
      <div className="absolute top-2 left-2 right-2 h-4 bg-red-600 rounded-sm"></div>
      <div className="absolute bottom-2 left-2 right-2 h-3 bg-red-700 rounded-sm"></div>
      <div className="absolute top-1/2 left-1 w-3 h-6 bg-yellow-400 rounded-l-sm"></div>
      <div className="absolute top-1/2 right-1 w-3 h-6 bg-yellow-400 rounded-r-sm"></div>
    </div>
  );
}