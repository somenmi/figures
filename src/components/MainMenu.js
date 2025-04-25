import React from 'react';
import { Button, Title } from '@vkontakte/vkui';
import { loadGame } from '../utils/storage';

const MainMenu = ({ onStartGame, onContinueGame, onShowRules, onShowRating }) => {
  const sizes = [4, 6, 8];
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGames = async () => {
      const sizes = [4, 6, 8];
      for (const size of sizes) {
        const game = await loadGame(size);
        if (game) {
          setHasSavedGame(true);
          break;
        }
      }
    };
    checkSavedGames();
  }, []);
  return (
    <div className="screen-container">
      <Title level="1" style={{ marginBottom: '30px', scale: '350%' }}>中凵⺁丫尸Ђ丨</Title>
      <div className="size-grid">
        {sizes.map(size => (
          <Button
            key={size}
            className="menu-button"
            onClick={() => onStartGame(size)}
            style={{ width: '70px' }}
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button
          className="menu-button"
          onClick={onShowRating}
        >
          Рейтинг
        </Button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button
          className="menu-button"
          onClick={onShowRules}
        >
          Правила
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;