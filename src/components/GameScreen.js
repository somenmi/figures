import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GameGrid from './GameGrid';
import { saveGame, saveRating } from '../utils/storage';
import { Button, Title } from '@vkontakte/vkui';

// Функция для объединения фигур
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

const GameScreen = ({ size, savedData, onBackToMenu }) => {
  // Получаем сохраненный цвет кнопок из localStorage
  const buttonColor = localStorage.getItem('buttonColor') || '#5181B8';

  // Инициализация состояния игры
  const [grid, setGrid] = useState(() => {
    if (savedData && savedData.grid && savedData.grid.length) {
      return savedData.grid;
    }

    const newGrid = Array(size).fill().map(() => Array(size).fill(0));
    return addRandomShape(addRandomShape(newGrid));
  });

  const [score, setScore] = useState(savedData?.score || 0);
  const [gameOver, setGameOver] = useState(false);
  const [prevGrid, setPrevGrid] = useState([]);

  // Функции движения (оптимизированные)
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

  // Проверка конца игры
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

  // Обработчик движения
  const handleMove = useCallback((moveFunction) => {
    if (gameOver) return;

    setPrevGrid(grid);
    setGrid(prev => {
      const newGrid = moveFunction(prev, setScore);
      return addRandomShape(newGrid);
    });
  }, [gameOver, grid]);

  // Автосохранение
  useEffect(() => {
    const timer = setInterval(async () => {
      await saveGame(size, { grid, score });
    }, 5000);

    return () => clearInterval(timer);
  }, [grid, score, size]);

  // Проверка завершения игры
  useEffect(() => {
    if (isGameOver(grid) && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        alert(`Игра окончена! Ваш счёт: ${score}\nРазмер поля: ${size}x${size}`);
        onBackToMenu();
      }, 500);
      saveRating(size, score);
      saveGame(size, null);
    }
  }, [grid, score, size, gameOver, isGameOver, onBackToMenu]);

  // Обработка клавиш
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

  // Рассчёт размера клетки
  const calculateCellSize = useCallback(() => {
    const viewportWidth = Math.min(window.innerWidth, 500);
    return Math.floor((viewportWidth * 0.9) / size);
  }, [size]);

  const [cellSize, setCellSize] = useState(calculateCellSize());

  // Адаптация к изменению размера экрана
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
      touchAction: 'manipulation',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: '#242424'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
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
    <div style={styles.container}>
      <div style={styles.header}>
        <Button 
          onClick={onBackToMenu}
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ◂ Меню
        </Button>
        <Title level="2" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '1.5px' }}>
          Счёт: {score}
        </Title>
      </div>

      <div style={styles.gameArea}>
        <GameGrid grid={grid} prevGrid={prevGrid} cellSize={cellSize} />
      </div>

      <div style={styles.controls}>
        <div></div>
        <Button 
          onClick={() => handleMove(moveUp)} 
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ▲
        </Button>
        <div></div>
        <Button 
          onClick={() => handleMove(moveLeft)} 
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ◀
        </Button>
        <Button 
          onClick={() => handleMove(moveDown)} 
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ▼
        </Button>
        <Button 
          onClick={() => handleMove(moveRight)} 
          style={{ backgroundColor: buttonColor, color: 'white' }}
        >
          ▶
        </Button>
      </div>

      {gameOver && (
        <div style={styles.gameOverScreen}>
          <Title level="1">Игра окончена!</Title>
          <div style={{ margin: '20px 0' }}>Ваш счёт: {score}</div>
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

// Вспомогательные функции
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