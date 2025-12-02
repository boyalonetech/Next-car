export interface Position {
  x: number;
  y: number;
}

export interface Car {
  position: Position;
  width: number;
  height: number;
  speed: number;
}

export interface Obstacle {
  id: number;
  position: Position;
  width: number;
  height: number;
  speed: number;
  passed: boolean;
}

export interface LevelConfig {
  level: number;
  obstacleSpeed: number;
  obstacleFrequency: number;
  carSpeed: number;
  scoreToNextLevel: number;
  obstacleTypes: string[];
  levelName: string;
}

export interface GameState {
  car: Car;
  obstacles: Obstacle[];
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  roadOffset: number;
  currentLevel: number;
  levelProgress: number;
}