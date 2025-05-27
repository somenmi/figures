import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import RulesScreen from './components/RulesScreen';
import RatingScreen from './components/RatingScreen';
import AudioController from './components/AudioController';
import bridge from '@vkontakte/vk-bridge';

function App() {
  // Разрешаем аудио в VK
  useEffect(() => {
    if (typeof window !== 'undefined' && window.vkBridge) {
      window.vkBridge.send('VKWebAppAllowAudioAds', {})
        .then(() => console.log('Audio permission granted'))
        .catch(e => console.error('Audio permission error:', e));
    }
  }, []);
  const [screen, setScreen] = useState('menu');
  const [gridSize, setGridSize] = useState(4);
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
  };

  const handleShowRules = (color) => {
    setCurrentColor(color);
    setScreen('rules');
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
          onShowRules={() => handleShowRules(currentColor)}
          onShowRating={() => handleShowRating(currentColor)}
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