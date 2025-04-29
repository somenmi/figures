import React from 'react';
import { Button, Title, Div } from '@vkontakte/vkui';
import '../RulesScreen.css';

const RulesScreen = ({ onBack, buttonColor }) => {
  return (
    <Div className="rules-container">
      <Title level="1" className="rules-title">
      冂尸升乃凵入闩
      </Title>

      <Div className="rules-list">
        <p className="rule rule-1">Используйте стрелки или свайпы для перемещения фигур</p>
        <p className="rule rule-2">Одинаковые фигуры объединяются в следующую по уровню</p>
        <p className="rule rule-3">Цель - получить фигуру 2048</p>
      </Div>
      
      <Button
        mode="primary"
        appearance="overlay"
        style={{
          backgroundColor: buttonColor,
          '--vkui--color_background_primary': buttonColor,
          '--vkui--color_background_primary_hover': `${buttonColor}CC`,
          '--vkui--color_background_primary_active': `${buttonColor}99`
        }}
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </Div>
  );
};

export default RulesScreen;