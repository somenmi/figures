import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GameGrid from './GameGrid';
import { saveRating } from '../utils/storage';
import { Button, Title } from '@vkontakte/vkui';

const mergeShapes = (row, setScore) => {
  const newRow = [...row];
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      if (setScore) setScore(prev => prev + newRow[i]);
    }
  }
  return newRow.filter(cell => cell !== 0);
};

const GameScreen = ({ size, onBackToMenu }) => {
  const [touchStart, setTouchStart] = useState(null);
  const buttonColor = localStorage.getItem('buttonColor') || '#5181B8';

  const [grid, setGrid] = useState(() => {
    const newGrid = Array(size).fill().map(() => Array(size).fill(0));
    return addRandomShape(addRandomShape(newGrid));
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [prevGrid, setPrevGrid] = useState([]);

  const moveLeft = useCallback((grid, setScore) => {
    if (!grid || !grid.length) return grid;

    return grid.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      const mergedRow = mergeShapes(filteredRow, setScore);
      return [...mergedRow, ...Array(row.length - mergedRow.length).fill(0)];
    });
  }, []);

  const moveRight = useCallback((grid, setScore) => {
    if (!grid || !grid.length) return grid;

    return grid.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      const mergedRow = mergeShapes(filteredRow, setScore);
      return [...Array(row.length - mergedRow.length).fill(0), ...mergedRow];
    });
  }, []);

  const moveUp = useCallback((grid, setScore) => {
    if (!grid || !grid.length) return grid;

    const newGrid = grid.map(row => [...row]);

    for (let col = 0; col < newGrid[0].length; col++) {
      let column = newGrid.map(row => row[col]).filter(cell => cell !== 0);
      column = mergeShapes(column, setScore);
      column = [...column, ...Array(newGrid.length - column.length).fill(0)];
      column.forEach((cell, rowIndex) => {
        newGrid[rowIndex][col] = cell;
      });
    }

    return newGrid;
  }, []);

  const moveDown = useCallback((grid, setScore) => {
    if (!grid || !grid.length) return grid;

    const newGrid = grid.map(row => [...row]);

    for (let col = 0; col < newGrid[0].length; col++) {
      let column = newGrid.map(row => row[col]).filter(cell => cell !== 0);
      column = mergeShapes(column, setScore);
      column = [...Array(newGrid.length - column.length).fill(0), ...column];
      column.forEach((cell, rowIndex) => {
        newGrid[rowIndex][col] = cell;
      });
    }

    return newGrid;
  }, []);

  const isGameOver = useCallback((grid) => {
    if (grid.some(row => row.some(cell => cell === 0))) return false;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (j < grid[i].length - 1 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < grid.length - 1 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }, []);

  const handleMove = useCallback((moveFunction) => {
    if (gameOver) return;

    setPrevGrid(grid);
    setGrid(prev => {
      const newGrid = moveFunction(prev, setScore);
      return addRandomShape(newGrid);
    });
  }, [gameOver, grid]);

  const handleTouchStart = useCallback((e) => {
    if (gameOver) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, [gameOver]);

  const handleTouchEnd = useCallback((e) => {
    if (gameOver || !touchStart) return;
    const touch = e.changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    // Определяем направление свайпа
    if (Math.abs(dx) > Math.abs(dy)) {
      // Горизонтальный свайп
      if (dx > 50) {
        handleMove(moveRight);
      } else if (dx < -50) {
        handleMove(moveLeft);
      }
    } else {
      // Вертикальный свайп
      if (dy > 50) {
        handleMove(moveDown);
      } else if (dy < -50) {
        handleMove(moveUp);
      }
    }

    setTouchStart(null);
  }, [gameOver, touchStart, handleMove, moveUp, moveDown, moveLeft, moveRight]);

  useEffect(() => {
    if (isGameOver(grid) && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        onBackToMenu();
      }, 10000);
      saveRating(size, score);
    }
  }, [grid, score, size, gameOver, isGameOver, onBackToMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a' || key === 'ф') {
        handleMove(moveLeft);
      }
      else if (key === 'arrowright' || key === 'd' || key === 'в') {
        handleMove(moveRight);
      }
      else if (key === 'arrowup' || key === 'w' || key === 'ц') {
        handleMove(moveUp);
      }
      else if (key === 'arrowdown' || key === 's' || key === 'ы') {
        handleMove(moveDown);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, handleMove, moveDown, moveLeft, moveRight, moveUp]);

  const calculateCellSize = useCallback(() => {
    const viewportWidth = Math.min(window.innerWidth, 500);
    return Math.floor((viewportWidth * 0.9) / size);
  }, [size]);

  const [cellSize, setCellSize] = useState(calculateCellSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCellSize]);

  const styles = useMemo(() => ({
    container: {
      touchAction: 'manipulation',
      height: '96vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      boxSizing: 'border-box'
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
    },
    controls: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: '10px'
    },
    gameOverScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }
  }), []);

  return (
    <div style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      <div style={styles.header}>
        <Button
          onClick={onBackToMenu}
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ◂ Меню
        </Button>
        <Title level="2" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '1.5px', marginTop: '24px' }}>
          Счёт: {score}
        </Title>
      </div>

      <div style={styles.gameArea}>
        <GameGrid grid={grid} prevGrid={prevGrid} cellSize={cellSize} />
      </div>

      {gameOver && (
        <div style={styles.gameOverScreen}>
          <Title level="1" style={{ textAlign: 'center' }}>А всё!<br />Игра окончена!</Title>
          <div style={{ margin: '20px 0', fontSize: '18px' }}>Ваш счёт: <span
            style={{ color: '#ff3030', fontWeight: '900', fontFamily: 'system-ui' }}>{score}</span></div>
          <Button
            size="l"
            onClick={onBackToMenu}
            style={{ marginTop: '20px', backgroundColor: buttonColor, color: 'white' }}
          >
            В меню
          </Button>
        </div>
      )}
    </div>
  );
};

const addRandomShape = (grid) => {
  const emptyCells = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) emptyCells.push([rowIndex, colIndex]);
    });
  });

  if (emptyCells.length === 0) return grid;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = Math.random() > 0.5 ? 1 : 2;
  return newGrid;
};

export default GameScreen;