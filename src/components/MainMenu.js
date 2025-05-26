import React, { useState, useEffect, useMemo } from 'react';
import { Button, Title, Div, Popover } from '@vkontakte/vkui';
import { Icon24Game, Icon24PaletteOutline } from '@vkontakte/icons';
import '../MainMenu.css';

const MainMenu = ({
  onStartGame,
  onShowRules,
  onShowRating,
  onColorChange,
  currentColor
}) => {
  const sizes = useMemo(() => [3, 4, 5], []);
  const [buttonColor, setButtonColor] = useState(currentColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorPresets = [
    { value: '#b85151', label: 'Красная долина' },
    { value: '#b88351', label: 'Светлый желто-коричневый' },
    { value: '#58b851', label: 'Темный желто-зеленый' },
    { value: '#5186b8', label: 'Синяя сталь' },
    { value: '#5451b8', label: 'Королевский синий' },
    { value: '#7c51b8', label: 'Королевский пурпурный' },
    { value: '#b55489', label: 'Фанданго' },
  ];

  useEffect(() => {
    setButtonColor(currentColor);
  }, [currentColor]);

  const handleColorChange = (color) => {
    setButtonColor(color);
    onColorChange(color);
    localStorage.setItem('buttonColor', color);
  };

  const adjustColor = (hexColor, brightness = 1, contrast = 1) => {
    // Преобразуем HEX в RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    // Яркость (brightness)
    r = Math.min(255, Math.max(0, (r - 127.5) * brightness + 127.5));
    g = Math.min(255, Math.max(0, (g - 127.5) * brightness + 127.5));
    b = Math.min(255, Math.max(0, (b - 127.5) * brightness + 127.5));

    // Контраст (contrast)
    r = Math.min(255, Math.max(0, (r - 127.5) * contrast + 127.5));
    g = Math.min(255, Math.max(0, (g - 127.5) * contrast + 127.5));
    b = Math.min(255, Math.max(0, (b - 127.5) * contrast + 127.5));

    // Возвращаем HEX
    return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
  };

  const titleStyle = {
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    filter: 'drop-shadow(0 4px 0.75px rgba(0, 0, 0, 0.8)) brightness(1.5) contrast(0.9)',
    fontSize: '46px',
    fontWeight: 700,
    backgroundImage: `linear-gradient(
  140deg,
  ${buttonColor},
  ${adjustColor(buttonColor, 1.2, 1.2)} 35%,
  ${adjustColor(buttonColor, 1.6, 1.6)} 110%
)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    lineHeight: 1.2,
    padding: '10px 0',
    margin: '0 0 12px',
    buttonColor: 'filter: brightness(2)',
  };

  return (
    <div className="menu-container">
      <Title level="1" className="game-title" style={titleStyle}>
        中凵⺁丫尸Ђ丨
      </Title>

      <div className="game-sizes-container">
        <Title level="2" className="section-title" style={{ marginBottom: '22px', fontSize: '20px', color: buttonColor }}>廾口乃升牙 凵厂尸丹:</Title>
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