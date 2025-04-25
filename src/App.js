import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen'; // Нужно создать этот компонент
import RatingScreen from './components/RatingScreen'; // Нужно создать этот компонент

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [gridSize, setGridSize] = useState(4);
  const [savedGame, setSavedGame] = useState(null);

  const handleContinue = async () => {
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
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
      
      {screen === 'rules' && (
        <RulesScreen 
          onBack={() => setScreen('menu')}
        />
      )}
      
      {screen === 'rating' && (
        <RatingScreen
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
};

export default App;