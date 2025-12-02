'use client';

import { LevelConfig } from '../types/game';

interface LevelProgressProps {
  currentLevel: number;
  levelProgress: number;
  score: number;
  levels: LevelConfig[];
}

export default function LevelProgress({ 
  currentLevel, 
  levelProgress, 
  score, 
  levels 
}: LevelProgressProps) {
  const currentLevelConfig = levels.find(level => level.level === currentLevel);
  const nextLevelConfig = levels.find(level => level.level === currentLevel + 1);

  if (!currentLevelConfig) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg min-w-[200px]">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-300">Level</div>
          <div className="font-bold text-lg">{currentLevelConfig.levelName}</div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-300">Score</div>
          <div className="font-bold">{score}</div>
        </div>

        {nextLevelConfig && (
          <>
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Next: {nextLevelConfig.levelName}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Need {nextLevelConfig.scoreToNextLevel - score} more points
            </div>
          </>
        )}

        {!nextLevelConfig && (
          <div className="text-xs text-yellow-400 mt-1">
            🏆 Maximum Level Reached!
          </div>
        )}
      </div>
    </div>
  );
}