import React, { useState } from 'react';
import GameGrid from './GameGrid';

const GameScreen = () => {
  const [grid, setGrid] = useState([
    [0, 1, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 4],
    [8, 0, 0, 0]
  ]);

  return (
    <div>
      <GameGrid grid={grid} cellSize={100} />
      <button onClick={() => alert('Движение вверх!')}>↑</button>
    </div>
  );
};

export default GameScreen;