import React from 'react';
import { Button, Div, Panel } from '@vkontakte/vkui';

const MainMenu = ({ onStartGame, onShowRating, onShowRules }) => {
  return (
    <Div>
      <h1>Фигуры</h1>
      <Button size="l" onClick={onStartGame}>Новая игра</Button>
      <Button size="l" onClick={onShowRating}>Рейтинг</Button>
      <Button size="l" onClick={onShowRules}>Правила</Button>
    </Div>
  );
};

export default MainMenu;