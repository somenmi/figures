import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen';
import RatingScreen from './components/RatingScreen';
import AudioController from './components/AudioController';

function App() {
  const [screen, setScreen] = useState('menu');
  const [gridSize, setGridSize] = useState(4);
  const [currentColor, setCurrentColor] = useState(
    localStorage.getItem('buttonColor') || '#5181B8'
  );

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

  return (
    <div className="app-container">
      {screen === 'menu' && (
        <MainMenu
          onStartGame={(size) => {
            setGridSize(size);
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

      <AudioController />
    </div>
  );
}

export default App;