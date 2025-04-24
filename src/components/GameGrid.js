// src/components/GameGrid.js
import React from 'react';
import { SHAPES } from '../game/shapes';

const GameGrid = ({ grid, cellSize }) => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
      gap: '8px'
    }}>
      {grid.flat().map((value, index) => ( // Добавьте параметр `value` здесь
        <div key={index} style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: value ? SHAPES[value].color : '#EEE',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: '"Noto Sans Symbols", sans-serif',
          fontSize: cellSize * 0.5,
          fontWeight: 'bold'
        }}>
          {value ? SHAPES[value].symbol : ''}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;