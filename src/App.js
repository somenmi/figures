import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';

function App() {
  const [screen, setScreen] = useState('menu');

  return (
    <div className="App">
      {screen === 'menu' && (
        <MainMenu 
          onStartGame={() => setScreen('game')}
          onShowRating={() => setScreen('rating')}
          onShowRules={() => setScreen('rules')}
        />
      )}
      {screen === 'game' && <GameScreen />}
    </div>
  );
}

export default App;