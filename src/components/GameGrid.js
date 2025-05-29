import React, { useEffect, useRef } from 'react';
import { SHAPES } from '../game/shapes';

const GameGrid = ({ grid = [], cellSize = 0, prevGrid = [] }) => {
  const cellRefs = useRef({});

  useEffect(() => {
    if (!grid.length || !cellSize) return;

    grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current[key];

        if (cellElement) {
          const prevCellValue = prevGrid?.[rowIndex]?.[colIndex] ?? 0;

          if (cellValue !== 0 && prevCellValue === 0) {
            cellElement.style.transform = 'scale(0.5)';
            cellElement.style.opacity = '0';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
              cellElement.style.opacity = '1';
            }, 10);
          }

          if (cellValue !== 0 && prevCellValue !== cellValue) {
            cellElement.style.transform = 'scale(0.88)';
            setTimeout(() => {
              cellElement.style.transform = 'scale(1)';
            }, 300);
          }
        }
      });
    });
  }, [grid, prevGrid, cellSize]);

  if (!grid.length || !cellSize) {
    return <div style={{ width: '100%', height: '100%' }} />;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
      gap: '1.4vmin',
      aspectRatio: '1/1',
      maxWidth: 'auto',
      maxHeight: 'auto',
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
              backgroundColor: cellValue ? SHAPES[cellValue]?.color || '#ccc' : ' #bfae97',
              fontSize: cellSize * 0.7,
              fontWeight: 'bold',
              borderRadius: '18px',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#242424',
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