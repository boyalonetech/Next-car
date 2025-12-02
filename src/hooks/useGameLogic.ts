'use client';

import { useReducer, useEffect, useCallback, useRef } from "react";
import { GameState, Obstacle, LevelConfig } from "../types/game";

// Define GameAction type for reducer actions
type GameAction =
  | { type: "MOVE_CAR"; payload: { direction: "left" | "right" } }
  | { type: "MOVE_CAR_TO"; payload: { x: number } }
  | { type: "UPDATE_GAME" }
  | { type: "ADD_OBSTACLE" }
  | { type: "START_GAME" }
  | { type: "RESET_GAME" }
  | { type: "GAME_OVER" };

const LEVELS: LevelConfig[] = [
  {
    level: 1,
    levelName: "Beginner",
    obstacleSpeed: 3,
    obstacleFrequency: 2000, // Slower obstacle generation
    carSpeed: 8,
    scoreToNextLevel: 500,
    obstacleTypes: ["rock"],
  },
  {
    level: 2,
    levelName: "Easy",
    obstacleSpeed: 4,
    obstacleFrequency: 1500,
    carSpeed: 8,
    scoreToNextLevel: 1000,
    obstacleTypes: ["rock", "cone"],
  },
  {
    level: 3,
    levelName: "Medium",
    obstacleSpeed: 5,
    obstacleFrequency: 1000,
    carSpeed: 9,
    scoreToNextLevel: 2000,
    obstacleTypes: ["rock", "cone", "barrier"],
  },
  {
    level: 4,
    levelName: "Hard",
    obstacleSpeed: 6,
    obstacleFrequency: 800,
    carSpeed: 9,
    scoreToNextLevel: 3000,
    obstacleTypes: ["rock", "cone", "barrier"],
  },
  {
    level: 5,
    levelName: "Expert",
    obstacleSpeed: 7,
    obstacleFrequency: 600,
    carSpeed: 10,
    scoreToNextLevel: 5000,
    obstacleTypes: ["rock", "cone", "barrier"],
  },
];

const GAME_CONFIG = {
  ROAD_WIDTH: 400,
  CAR_WIDTH: 50,
  CAR_HEIGHT: 80,
  OBSTACLE_WIDTH: 60,
  OBSTACLE_HEIGHT: 60,
  ROAD_SPEED: 3,
} as const;

const getInitialState = (): GameState => ({
  car: {
    position: {
      x: GAME_CONFIG.ROAD_WIDTH / 2 - GAME_CONFIG.CAR_WIDTH / 2,
      y: 500,
    },
    width: GAME_CONFIG.CAR_WIDTH,
    height: GAME_CONFIG.CAR_HEIGHT,
    speed: LEVELS[0].carSpeed,
  },
  obstacles: [],
  score: 0,
  gameOver: false,
  gameStarted: false,
  roadOffset: 0,
  currentLevel: 1,
  levelProgress: 0,
});

function gameReducer(state: GameState, action: GameAction): GameState {
  const currentLevelConfig =
    LEVELS.find((level) => level.level === state.currentLevel) || LEVELS[0];

  switch (action.type) {
    case "MOVE_CAR":
      if (state.gameOver || !state.gameStarted) return state;

      const newX =
        action.payload.direction === "left"
          ? Math.max(0, state.car.position.x - state.car.speed)
          : Math.min(
              GAME_CONFIG.ROAD_WIDTH - state.car.width,
              state.car.position.x + state.car.speed
            );

      return {
        ...state,
        car: {
          ...state.car,
          position: { ...state.car.position, x: newX },
        },
      };

    case "MOVE_CAR_TO":
      if (state.gameOver || !state.gameStarted) return state;

      // Calculate the center position for the car
      const carCenterX = action.payload.x - state.car.width / 2;
      
      // Clamp the position within road boundaries
      const clampedX = Math.max(
        0,
        Math.min(
          GAME_CONFIG.ROAD_WIDTH - state.car.width,
          carCenterX
        )
      );

      return {
        ...state,
        car: {
          ...state.car,
          position: { ...state.car.position, x: clampedX },
        },
      };

    case "UPDATE_GAME":
      if (state.gameOver || !state.gameStarted) return state;

      const newRoadOffset = (state.roadOffset + GAME_CONFIG.ROAD_SPEED) % 100;

      const updatedObstacles = state.obstacles
        .map((obstacle) => ({
          ...obstacle,
          position: {
            ...obstacle.position,
            y: obstacle.position.y + currentLevelConfig.obstacleSpeed,
          },
        }))
        .filter((obstacle) => obstacle.position.y < 600);

      const collision = updatedObstacles.some((obstacle) => {
        const car = state.car;
        return (
          car.position.x < obstacle.position.x + obstacle.width &&
          car.position.x + car.width > obstacle.position.x &&
          car.position.y < obstacle.position.y + obstacle.height &&
          car.position.y + car.height > obstacle.position.y
        );
      });

      const newScore = state.score + 1;
      const passedObstacles = updatedObstacles.filter(
        (obstacle) =>
          !obstacle.passed && obstacle.position.y > state.car.position.y
      );
      const scoreIncrease = passedObstacles.length;
      const totalNewScore = newScore + scoreIncrease;

      // Check for level up
      let newLevel = state.currentLevel;
      let newLevelProgress = state.levelProgress;

      if (
        totalNewScore >= currentLevelConfig.scoreToNextLevel &&
        state.currentLevel < LEVELS.length
      ) {
        newLevel = state.currentLevel + 1;
        newLevelProgress = 0;
      } else {
        newLevelProgress =
          (totalNewScore / currentLevelConfig.scoreToNextLevel) * 100;
      }

      if (collision) {
        return { ...state, gameOver: true };
      }

      const nextLevelConfig =
        LEVELS.find((level) => level.level === newLevel) || currentLevelConfig;

      return {
        ...state,
        obstacles: updatedObstacles.map((obstacle) => ({
          ...obstacle,
          passed: obstacle.passed || obstacle.position.y > state.car.position.y,
        })),
        score: totalNewScore,
        roadOffset: newRoadOffset,
        currentLevel: newLevel,
        levelProgress: Math.min(newLevelProgress, 100),
        car: {
          ...state.car,
          speed: nextLevelConfig.carSpeed,
        },
      };

    case "ADD_OBSTACLE":
      if (state.gameOver || !state.gameStarted) return state;

    //   const obstacleType =
    //     currentLevelConfig.obstacleTypes[
    //       Math.floor(Math.random() * currentLevelConfig.obstacleTypes.length)
    //     ];

      const newObstacle: Obstacle = {
        id: Date.now(),
        position: {
          x:
            Math.random() *
            (GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.OBSTACLE_WIDTH),
          y: -GAME_CONFIG.OBSTACLE_HEIGHT,
        },
        width: GAME_CONFIG.OBSTACLE_WIDTH,
        height: GAME_CONFIG.OBSTACLE_HEIGHT,
        speed: currentLevelConfig.obstacleSpeed,
        passed: false,
      };

      return {
        ...state,
        obstacles: [...state.obstacles, newObstacle],
      };

    case "START_GAME":
      return {
        ...getInitialState(),
        gameStarted: true,
      };

    case "RESET_GAME":
      return getInitialState();

    case "GAME_OVER":
      return {
        ...state,
        gameOver: true,
      };

    default:
      return state;
  }
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);

  const moveCar = useCallback((direction: "left" | "right") => {
    dispatch({ type: "MOVE_CAR", payload: { direction } });
  }, []);

  const moveCarTo = useCallback((clientX: number) => {
    if (!gameContainerRef.current) return;
    
    const gameRect = gameContainerRef.current.getBoundingClientRect();
    const relativeX = clientX - gameRect.left;
    
    dispatch({ type: "MOVE_CAR_TO", payload: { x: relativeX } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!state.gameStarted || state.gameOver) return;
    
    isMouseDown.current = true;
    moveCarTo(event.clientX);
  }, [state.gameStarted, state.gameOver, moveCarTo]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!state.gameStarted || state.gameOver || !isMouseDown.current) return;
    
    moveCarTo(event.clientX);
  }, [state.gameStarted, state.gameOver, moveCarTo]);

  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!state.gameStarted || state.gameOver) return;
    
    isMouseDown.current = true;
    const touch = event.touches[0];
    moveCarTo(touch.clientX);
  }, [state.gameStarted, state.gameOver, moveCarTo]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!state.gameStarted || state.gameOver || !isMouseDown.current) return;
    
    const touch = event.touches[0];
    moveCarTo(touch.clientX);
    event.preventDefault(); // Prevent scrolling
  }, [state.gameStarted, state.gameOver, moveCarTo]);

  const handleTouchEnd = useCallback(() => {
    isMouseDown.current = false;
  }, []);

  // Game loop
  useEffect(() => {
    if (!state.gameStarted || state.gameOver) return;

    const currentLevelConfig =
      LEVELS.find((level) => level.level === state.currentLevel) || LEVELS[0];

    const gameLoop = setInterval(() => {
      dispatch({ type: "UPDATE_GAME" });
    }, 16);

    const obstacleInterval = setInterval(() => {
      dispatch({ type: "ADD_OBSTACLE" });
    }, currentLevelConfig.obstacleFrequency);

    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleInterval);
    };
  }, [state.gameStarted, state.gameOver, state.currentLevel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!state.gameStarted || state.gameOver) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          moveCar("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          moveCar("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveCar, state.gameStarted, state.gameOver]);

  // Global mouse up listener (in case mouse up happens outside the game area)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return {
    state,
    moveCar,
    moveCarTo,
    startGame,
    resetGame,
    levels: LEVELS,
    gameContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}