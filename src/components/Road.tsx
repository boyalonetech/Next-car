'use client';

interface RoadProps {
  width: number;
  offset: number;
}

export default function Road({ width, offset }: RoadProps) {
  return (
    <div className="relative bg-gray-800" style={{ width, height: 600 }}>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-yellow-300"
        style={{
          height: '100%',
          background: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 20px,
            yellow 20px,
            yellow 40px
          )`,
          backgroundPosition: `0 ${offset}px`,
        }}
      />
      
      <div className="absolute left-0 top-0 w-2 h-full bg-white"></div>
      <div className="absolute right-0 top-0 w-2 h-full bg-white"></div>
    </div>
  );
}