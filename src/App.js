import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen';
import RatingScreen from './components/RatingScreen';
import { loadGame } from './utils/storage'; // Добавьте этот импорт

function App() {
  const [screen, setScreen] = useState('menu');
  const [gridSize, setGridSize] = useState(4);
  const [savedGame, setSavedGame] = useState(null);

  // Функция для продолжения игры
  const handleContinue = useCallback(async () => {
    const sizes = [4, 6, 8];
    for (const size of sizes) {
      const game = await loadGame(size);
      if (game) {
        setGridSize(size);
        setSavedGame(game);
        setScreen('game');
        break;
      }
    }
  }, []);

  return (
    <div className="app-container">
      {screen === 'menu' && (
        <MainMenu
          onStartGame={(size) => {
            setGridSize(size);
            setSavedGame(null);
            setScreen('game');
          }}
          onContinueGame={handleContinue}
          onShowRules={() => setScreen('rules')}
          onShowRating={() => setScreen('rating')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          size={gridSize}
          savedData={savedGame}
          onBackToMenu={() => setScreen('menu')}
        />
      )}

      {screen === 'rules' && <RulesScreen onBack={() => setScreen('menu')} />}

      {screen === 'rating' && (
        <RatingScreen
          gridSize={gridSize}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
}

export default App;