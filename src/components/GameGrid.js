import React, { useEffect, useRef } from 'react';
import { SHAPES } from '../game/shapes';

const GameGrid = ({ grid, cellSize, prevGrid }) => {
  const cellRefs = useRef({});

  // Анимация при изменении значений
  useEffect(() => {
    grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current[key];

        if (cellElement) {
          // Анимация для новых фигур
          if (cellValue !== 0 && (!prevGrid || prevGrid[rowIndex][colIndex] === 0)) {
            cellElement.style.transform = 'scale(0.5)';
            cellElement.style.opacity = '0';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
              cellElement.style.opacity = '1';
            }, 10);
          }

          // Анимация для слияния
          if (prevGrid && cellValue !== 0 && prevGrid[rowIndex][colIndex] !== cellValue) {
            cellElement.style.transform = 'scale(0.9)';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
            }, 300);
          }
        }
      });
    });
  }, [grid, prevGrid]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
      gap: '1vmin',
      aspectRatio: '1/1',
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 'auto'
    }}>
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            ref={el => cellRefs.current[`${rowIndex}-${colIndex}`] = el}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: cellValue ? SHAPES[cellValue].color : '#bfae97',
              fontSize: cellSize * 0.5,
              fontWeight: 'bold',
              borderRadius: '22px',
              transition: 'all 0.2s ease-out'
            }}
          >
            {cellValue !== 0 && (
              <span className="cell-symbol">
                {SHAPES[cellValue].symbol}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameGrid;