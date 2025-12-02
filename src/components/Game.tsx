'use client';

import { useGameLogic } from '../hooks/useGameLogic';
import Car from './Car';
import Obstacle from './Obstacle';
import Road from './Road';
import Score from './Score';
import LevelProgress from './LevelProgress';

const ROAD_WIDTH = 400;

export default function Game() {
  const { 
    state, 
    moveCar, 
    startGame, 
    resetGame, 
    levels,
    gameContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useGameLogic();
  
  const currentLevelConfig = levels.find(level => level.level === state.currentLevel);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-2">Car Racing Game</h1>
      <p className="text-gray-400 mb-4">Level: {currentLevelConfig?.levelName}</p>
      
      <div 
        ref={gameContainerRef}
        className="relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }} // Prevent browser touch actions
      >
        <Road width={ROAD_WIDTH} offset={state.roadOffset} />
        
        <Car car={state.car} />
        {state.obstacles.map(obstacle => (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        ))}
        
        <Score score={state.score} gameOver={state.gameOver} />
        <LevelProgress 
          currentLevel={state.currentLevel}
          levelProgress={state.levelProgress}
          score={state.score}
          levels={levels}
        />
        
        {!state.gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
            <div className="text-center text-white max-w-md">
              <h2 className="text-3xl font-bold mb-4">Car Racing Game</h2>
              <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Controls</h3>
                <div className="text-left space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-6">🎮</span>
                    <span>Arrow Keys: Move left/right</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6">🖱️</span>
                    <span>Mouse/Touch: Click and drag to move</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6">📱</span>
                    <span>Mobile: Touch buttons or drag</span>
                  </div>
                </div>
              </div>
              <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Level Progression</h3>
                <div className="text-left space-y-1 text-sm">
                  {levels.map(level => (
                    <div key={level.level} className="flex justify-between">
                      <span>Level {level.level}: {level.levelName}</span>
                      <span className="text-yellow-400">{level.scoreToNextLevel} pts</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-green-400">
                🖱️ Try mouse/touch controls for precise movement!
              </p>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
              >
                Start Game - Level 1
              </button>
            </div>
          </div>
        )}
        
        {state.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-2xl mb-2">Final Score: {state.score}</p>
              <p className="text-lg mb-4">Reached: {currentLevelConfig?.levelName}</p>
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Level Up Notification */}
        {state.levelProgress === 0 && state.score > 0 && state.currentLevel > 1 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-yellow-500 bg-opacity-90 text-black font-bold py-4 px-8 rounded-lg text-2xl animate-bounce">
              🎉 Level {state.currentLevel} Unlocked! 🎉
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => moveCar('left')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!state.gameStarted || state.gameOver}
        >
          ←
        </button>
        <button
          onClick={() => moveCar('right')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!state.gameStarted || state.gameOver}
        >
          →
        </button>
      </div>
      
      <div className="mt-4 text-gray-400 text-center max-w-md">
        <p className="mb-1">Use arrow keys, buttons, or mouse/touch to control the car</p>
        <p>Click and drag on the road for precise movement!</p>
        <p>Avoid obstacles and progress through {levels.length} levels!</p>
        <p className="text-sm mt-2 text-yellow-400">
          Current: {currentLevelConfig?.levelName} • Speed: {currentLevelConfig?.obstacleSpeed}
        </p>
      </div>

      {/* Control Instructions */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg max-w-md">
        <h3 className="text-white font-bold mb-2">Control Methods:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="font-bold">Keyboard</div>
            <div>← → Arrow Keys</div>
          </div>
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="font-bold">Mouse</div>
            <div>Click & Drag</div>
          </div>
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="font-bold">Touch</div>
            <div>Tap & Drag</div>
          </div>
        </div>
      </div>
    </div>
  );
}