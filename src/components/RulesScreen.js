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
        <p className="rule rule-3" style={{file}}>Цель : Топ 1 в Рейтинге</p>
      </Div>
      
      <Button
        className="cbutton"
        style={{
          backgroundColor: buttonColor
        }}
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </Div>
  );
};

export default RulesScreen;