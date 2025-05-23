import React, { useState, useEffect, useMemo } from 'react';
import { Button, Title, Div, Popover } from '@vkontakte/vkui';
import { Icon24Game, Icon24PaletteOutline } from '@vkontakte/icons';
import { loadGame } from '../utils/storage';
import '../MainMenu.css';

const MainMenu = ({
  onStartGame,
  onContinueGame,
  onShowRules,
  onShowRating,
  onColorChange,
  currentColor
}) => {
  const sizes = useMemo(() => [3, 4, 5], []);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [buttonColor, setButtonColor] = useState(currentColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorPresets = [
    { value: '#5181B8', label: 'Синий' },
    { value: '#b85173', label: 'Малиновый' },
    { value: '#58b851', label: 'Богомол' },
    { value: '#b88d51', label: 'Золото' },
    { value: '#7751b8', label: 'Фиолетовый' },
  ];

  useEffect(() => {
    setButtonColor(currentColor);
  }, [currentColor]);

  const handleColorChange = (color) => {
    setButtonColor(color);
    onColorChange(color);
    localStorage.setItem('buttonColor', color);
  };

  // Улучшенная проверка сохранённой игры
  useEffect(() => {
    let isMounted = true;
    
    const checkSavedGames = async () => {
      try {
        for (const size of sizes) {
          const game = await loadGame(size);
          if (game && isMounted) {
            setHasSavedGame(true);
            console.log('Saved game found for size:', size, game);
            break;
          }
        }
      } catch (error) {
        console.error('Error checking saved games:', error);
      }
    };

    checkSavedGames();
    
    return () => {
      isMounted = false;
    };
  }, [sizes]);

  return (
    <div className="menu-container">
      <Title level="1" className="game-title" style={{ marginBottom: '36px', fontSize: '46px' }}>
        中凵⺁丫尸Ђ丨
      </Title>

      {/* Кнопка "Продолжить" - сделаем её более заметной */}
      {hasSavedGame && (
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '200px' }}>
          <Button
            size="l"
            className="menu-button"
            style={{ 
              backgroundColor: buttonColor,
              width: '100%'
            }}
            onClick={onContinueGame}
          >
            Продолжить
          </Button>
        </div>
      )}

      <div className="game-sizes-container">
        <Title level="2" className="section-title" style={{ marginBottom: '22px', fontSize: '20px' }}>廾口乃升牙 凵厂尸丹:</Title>
        <div className="game-sizes">
          {sizes.map(size => (
            <Button
              key={size}
              size="m"
              before={<Icon24Game />}
              className="main-menu-size-button"
              style={{ backgroundColor: buttonColor }}
              onClick={() => onStartGame(size)}
            >
              {size}x{size}
            </Button>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <Button
          size="l"
          className="action-button"
          style={{ backgroundColor: buttonColor }}
          onClick={() => onShowRating(buttonColor)}
        >
          Рейтинг
        </Button>
        <Button
          size="l"
          className="action-button"
          style={{ backgroundColor: buttonColor }}
          onClick={() => onShowRules(buttonColor)}
        >
          Правила
        </Button>
      </div>

      <Popover
        action="click"
        className="custom-popover-root"
        popoverClassName="custom-popover-content"
        shown={showColorPicker}
        onShownChange={setShowColorPicker}
        content={
          <Div className="color-picker-popover">
            <h3 className="color-picker-title">Выберите цвет кнопок</h3>
            <div className="color-presets">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  className="color-option"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  title={color.label}
                />
              ))}
            </div>
            <div className="custom-color-input">
              <span>Свой цвет:</span>
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
          </Div>
        }
      >
        <Button
          before={<Icon24PaletteOutline />}
          size="m"
          mode="outline"
          className="color-picker-button"
        >
          Цвет кнопок
        </Button>
      </Popover>
    </div>
  );
};

export default MainMenu;