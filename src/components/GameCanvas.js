import React, { useRef, useEffect } from 'react';
import { SHAPES } from '../game/shapes';

const GameCanvas = ({ grid, cellSize }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        if (cellValue > 0) {
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;
          const shape = SHAPES[cellValue];
          ctx.fillStyle = shape.color;
          shape.draw(ctx, x, y, cellSize);
        }
      });
    });
  }, [grid, cellSize]);

  return <canvas ref={canvasRef} width={cellSize * grid[0].length} height={cellSize * grid.length} />;
};

export default GameCanvas;