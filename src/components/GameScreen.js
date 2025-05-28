import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import GameGrid from './GameGrid';
import { saveRating } from '../utils/storage';
import { Button, Title } from '@vkontakte/vkui';
import { Icon24ArrowUturnLeftOutline } from '@vkontakte/icons';

// Оптимизированная функция объединения фигур
const mergeShapes = (row) => {
  const newRow = [...row];
  let scoreIncrease = 0;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
      newRow[i] *= 2;
      scoreIncrease += newRow[i];
      newRow[i + 1] = 0;
    }
  }

  return {
    mergedRow: newRow.filter(cell => cell !== 0),
    scoreIncrease
  };
};

const GameScreen = ({ size, onBackToMenu }) => {
  const touchStartRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const buttonColor = localStorage.getItem('buttonColor') || '#5181B8';

  const [gameState, setGameState] = useState(() => ({
    grid: addRandomShape(addRandomShape(Array(size).fill().map(() => Array(size).fill(0)))),
    score: 0,
    gameOver: false,
    prevGrid: []
  }));

  // Функции движения
  const moveLeft = useCallback((grid) => {
    let totalScore = 0;
    const newGrid = grid.map(row => {
      const { mergedRow, scoreIncrease } = mergeShapes(row.filter(cell => cell !== 0));
      totalScore += scoreIncrease;
      return [...mergedRow, ...Array(row.length - mergedRow.length).fill(0)];
    });
    return { grid: newGrid, score: totalScore };
  }, []);

  const moveRight = useCallback((grid) => {
    let totalScore = 0;
    const newGrid = grid.map(row => {
      const { mergedRow, scoreIncrease } = mergeShapes(row.filter(cell => cell !== 0));
      totalScore += scoreIncrease;
      return [...Array(row.length - mergedRow.length).fill(0), ...mergedRow];
    });
    return { grid: newGrid, score: totalScore };
  }, []);

  const moveUp = useCallback((grid) => {
    let totalScore = 0;
    const newGrid = grid.map(row => [...row]);

    for (let col = 0; col < newGrid[0].length; col++) {
      let column = newGrid.map(row => row[col]).filter(cell => cell !== 0);
      const { mergedRow, scoreIncrease } = mergeShapes(column);
      totalScore += scoreIncrease;
      column = [...mergedRow, ...Array(newGrid.length - mergedRow.length).fill(0)];
      column.forEach((cell, rowIndex) => {
        newGrid[rowIndex][col] = cell;
      });
    }

    return { grid: newGrid, score: totalScore };
  }, []);

  const moveDown = useCallback((grid) => {
    let totalScore = 0;
    const newGrid = grid.map(row => [...row]);

    for (let col = 0; col < newGrid[0].length; col++) {
      let column = newGrid.map(row => row[col]).filter(cell => cell !== 0);
      const { mergedRow, scoreIncrease } = mergeShapes(column);
      totalScore += scoreIncrease;
      column = [...Array(newGrid.length - mergedRow.length).fill(0), ...mergedRow];
      column.forEach((cell, rowIndex) => {
        newGrid[rowIndex][col] = cell;
      });
    }

    return { grid: newGrid, score: totalScore };
  }, []);

  // Проверка окончания игры
  const isGameOver = useCallback((grid) => {
    const size = grid.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) return false;
        if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }, []);

  // Обработчик движения
  const handleMove = useCallback((moveFunction) => {
    const now = performance.now();
    if (now - lastMoveTimeRef.current < 100) return;
    lastMoveTimeRef.current = now;

    setGameState(prev => {
      if (prev.gameOver) return prev;

      const { grid: newGrid, score: additionalScore } = moveFunction(prev.grid);
      if (JSON.stringify(prev.grid) === JSON.stringify(newGrid)) return prev;

      const updatedGrid = addRandomShape(newGrid);
      const gameOver = isGameOver(updatedGrid);
      const newScore = prev.score + additionalScore;

      if (gameOver) {
        saveRating(size, newScore);
        setTimeout(onBackToMenu, 150000);
      }

      return {
        ...prev,
        grid: updatedGrid,
        prevGrid: prev.grid,
        score: newScore,
        gameOver
      };
    });
  }, [isGameOver, onBackToMenu, size]);

  // Обработчики касаний
  const handleTouchStart = useCallback((e) => {
    if (gameState.gameOver) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: performance.now()
    };
  }, [gameState.gameOver]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const { x: startX, y: startY, time: startTime } = touchStartRef.current;

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const timeDiff = performance.now() - startTime;

    const minDistance = 30;
    const maxTime = 250;
    const velocityThreshold = 0.3;

    if (timeDiff > maxTime && (absDx / timeDiff < velocityThreshold && absDy / timeDiff < velocityThreshold)) {
      touchStartRef.current = null;
      return;
    }

    if (absDx > absDy && absDx > minDistance) {
      handleMove(dx > 0 ? moveRight : moveLeft);
    } else if (absDy > minDistance) {
      handleMove(dy > 0 ? moveDown : moveUp);
    }

    touchStartRef.current = null;
  }, [handleMove, moveDown, moveLeft, moveRight, moveUp]);

  // Обработчик клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.gameOver) return;
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a' || key === 'ф') handleMove(moveLeft);
      else if (key === 'arrowright' || key === 'd' || key === 'в') handleMove(moveRight);
      else if (key === 'arrowup' || key === 'w' || key === 'ц') handleMove(moveUp);
      else if (key === 'arrowdown' || key === 's' || key === 'ы') handleMove(moveDown);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver, handleMove, moveDown, moveLeft, moveRight, moveUp]);

  // Расчет размера ячейки
  const calculateCellSize = useCallback(() => {
    return Math.floor((Math.min(window.innerWidth, 500) * 0.9) / size);
  }, [size]);

  const [cellSize, setCellSize] = useState(calculateCellSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCellSize]);

  // Стили
  const styles = useMemo(() => ({
    container: {
      touchAction: 'none',
      height: '96vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      boxSizing: 'border-box',
      userSelect: 'none'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '26px'
    },
    gameArea: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }), []);

  return (
    <div
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={styles.header}>
        <Button
          before={<Icon24ArrowUturnLeftOutline />}
          onClick={onBackToMenu}
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          Меню
        </Button>
        <Title level="2" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '24px' }}>
          Счёт: {gameState.score}
        </Title>
      </div>

      <div style={styles.gameArea}>
        <GameGrid
          grid={gameState.grid}
          prevGrid={gameState.prevGrid}
          cellSize={cellSize}
        />
      </div>

      {gameState.gameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white'
        }}>
          <Title level="1" style={{ textAlign: 'center', fontSize: '180%', color: 'rgb(209, 209, 209)' }}>А всё!<br /><span style={{ color: '#fff' }} >Игра окончена!</span></Title>
          <div style={{ margin: '20px 0', fontSize: '22px' }}>Ваш счёт: <span
            style={{
              color: '#ff3030',
              fontWeight: '900', fontFamily: 'system-ui',
              padding: '0 8px',
              textShadow: 'rgb(0, 0, 0, 0.8) 0 2px 1.1px',
              marginBottom: '10px',
              fontSize: '120%'
            }}>{' '}{gameState.score}{' '}</span></div>
          <Button
            size="l"
            onClick={onBackToMenu}
            style={{
              marginTop: '20px',
              backgroundColor: buttonColor,
              color: 'white'
            }}
          >
            В меню
          </Button>
        </div>
      )}
    </div>
  );
};

// Вспомогательная функция добавления случайной фигуры
const addRandomShape = (grid) => {
  const emptyCells = [];
  grid.forEach((row, i) => row.forEach((cell, j) => {
    if (cell === 0) emptyCells.push([i, j]);
  }));

  if (emptyCells.length === 0) return grid;

  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[i][j] = Math.random() > 0.5 ? 1 : 2;
  return newGrid;
};

export default GameScreen;