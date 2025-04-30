import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen';
import RatingScreen from './components/RatingScreen';
import { loadGame } from './utils/storage'; // Добавьте этот импорт

function App() {
  const [screen, setScreen] = useState('menu');
  const [screenProps, setScreenProps] = useState({});
  const [gridSize, setGridSize] = useState(4);
  const [savedGame, setSavedGame] = useState(null);
  const [currentColor, setCurrentColor] = useState(
    localStorage.getItem('buttonColor') || '#5181B8'
  );

  const handleColorChange = (color) => {
    setCurrentColor(color);
    localStorage.setItem('buttonColor', color);
  };

  const handleShowRating = (color) => {
    setCurrentColor(color);
    setScreen('rating');
    setScreenProps({ buttonColor: color });
  };

  const handleShowRules = (color) => {
    setCurrentColor(color);
    setScreen('rules');
    setScreenProps({ buttonColor: color });
  };

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
          currentColor={currentColor}
          onColorChange={handleColorChange}
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

      {screen === 'rules' && (
        <RulesScreen
          onBack={() => setScreen('menu')}
          buttonColor={currentColor}
        />
      )}

      {screen === 'rating' && (
        <RatingScreen
          onBack={() => setScreen('menu')}
          buttonColor={currentColor}
        />
      )}
    </div>
  );
}

export default App;