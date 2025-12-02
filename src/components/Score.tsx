'use client';

interface ScoreProps {
  score: number;
  gameOver: boolean;
}

export default function Score({ score, gameOver }: ScoreProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
        <div className="text-lg font-bold">Score: {score}</div>
        {gameOver && (
          <div className="text-red-400 font-bold mt-1">GAME OVER!</div>
        )}
      </div>
    </div>
  );
}