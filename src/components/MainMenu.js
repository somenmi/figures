import React, { useState, useEffect } from 'react';
import { Button, Title, Button } from '@vkontakte/vkui';
import { Icon24Game } from '@vkontakte/icons';
import { loadGame } from '../utils/storage';

const MainMenu = ({ onStartGame, onContinueGame, onShowRules, onShowRating }) => {
  const sizes = [4, 6, 8];
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGames = async () => {
      try {
        for (const size of sizes) {
          const game = await loadGame(size);
          if (game) {
            setHasSavedGame(true);
            break;
          }
        }
      } catch (error) {
        console.error('Error checking saved games:', error);
      }
    };
    
    checkSavedGames();
  }, [sizes]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Title level="1" style={{ marginBottom: '40px', fontSize: '32px' }}>
        中凵⺁丫尸Ђ丨
      </Title>

      {hasSavedGame && (
        <Button 
          size="l"
          style={{ width: '200px', marginBottom: '15px' }}
          onClick={onContinueGame}
        >
          Продолжить
        </Button>
      )}

      <div style={{ marginBottom: '30px' }}>
        <Title level="2" style={{ marginBottom: '15px' }}>Новая игра:</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          {sizes.map(size => (
            <Button
              key={size}
              size="m"
              before={<Icon24Game />}
              onClick={() => onStartGame(size)}
              style={{ width: '70px' }}
            >
              {size}x{size}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button 
          size="l"
          style={{ width: '150px' }}
          onClick={onShowRating}
        >
          Рейтинг
        </Button>
        <Button 
          size="l"
          style={{ width: '150px' }}
          onClick={onShowRules}
        >
          Правила
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;