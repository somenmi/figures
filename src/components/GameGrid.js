import React, { useEffect, useRef } from 'react';
import { SHAPES } from '../game/shapes';

const GameGrid = ({ grid = [], cellSize = 0, prevGrid = [] }) => {
  const cellRefs = useRef({});

  // Анимация при изменении значений
  useEffect(() => {
    if (!grid.length || !cellSize) return;

    grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current[key];

        if (cellElement) {
          // Проверка на существование prevGrid и его элементов
          const prevCellValue = prevGrid?.[rowIndex]?.[colIndex] ?? 0;

          // Анимация для новых фигур
          if (cellValue !== 0 && prevCellValue === 0) {
            cellElement.style.transform = 'scale(0.5)';
            cellElement.style.opacity = '0';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
              cellElement.style.opacity = '1';
            }, 10);
          }

          // Анимация для слияния
          if (cellValue !== 0 && prevCellValue !== cellValue) {
            cellElement.style.transform = 'scale(0.9)';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
            }, 300);
          }
        }
      });
    });
  }, [grid, prevGrid, cellSize]);

  // Проверка на пустую сетку (после всех хуков!)
  if (!grid.length || !cellSize) {
    return <div style={{ width: '100%', height: '100%' }} />;
  }

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
              backgroundColor: cellValue ? SHAPES[cellValue]?.color || '#ccc' : '#bfae97',
              fontSize: cellSize * 0.5,
              fontWeight: 'bold',
              borderRadius: '22px',
              transition: 'all 0.2s ease-out',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {cellValue !== 0 && SHAPES[cellValue] && (
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