import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen';
import RatingScreen from './components/RatingScreen';
import AudioController from './components/AudioController';

function App() {
  const [screen, setScreen] = useState('menu');
  const [gridSize, setGridSize] = useState({ width: 4, height: 4 });
  const [currentColor, setCurrentColor] = useState(
    localStorage.getItem('buttonColor') || '#5181B8'
  );
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const initVK = async () => {
      if (typeof window.vkBridge !== 'undefined') {
        try {
          await window.vkBridge.send('VKWebAppInit');
          await window.vkBridge.send('VKWebAppAllowNotifications');
        } catch (e) {
          console.warn('VK Bridge init error:', e);
        }
      }
    };
    initVK();
  }, []);

  const handleColorChange = (color) => {
    setCurrentColor(color);
    localStorage.setItem('buttonColor', color);
  };

  const handleStartGame = (size) => {
    setGridSize(size);
    setGameKey(prev => prev + 1);
    setTimeout(() => {
      setScreen('game');
    }, 50);
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setTimeout(() => {
      setGameKey(prev => prev + 1);
    }, 100);
  };

  return (
    <div className="app-container">
      {screen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          currentColor={currentColor}
          onColorChange={handleColorChange}
          onShowRules={() => setScreen('rules')}
          onShowRating={() => setScreen('rating')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          key={`game-${gameKey}-${gridSize.width}x${gridSize.height}`}
          size={gridSize}
          onBackToMenu={handleBackToMenu}
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

      <AudioController />
    </div>
  );
}

export default App;