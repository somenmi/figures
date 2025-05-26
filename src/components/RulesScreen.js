import React from 'react';
import { Button, Title, Div } from '@vkontakte/vkui';
import '../RulesScreen.css';

const RulesScreen = ({ onBack, buttonColor }) => {
  return (
    <Div className="rules-container">
      <Title level="1" className="rules-title" style={{ color: buttonColor }}>
        冂尸升乃凵入闩
      </Title>

      <Div className="rules-list" style={{fontSize: '105%'}}>
        <p className="rule rule-1">"<span className="co">WASD</span>" или ⬅️⬆️⬇️➡️ — для ПК,<br /><span className="co">СВАЙПЫ</span> — для смартфонов</p>
        <p className="rule rule-2">Одинаковые фигуры объединяются<br />в следующую по уровню</p>
        <p className="rule rule-3">Цель : <span className="co">ТОП №1</span> в <span className="co">Рейтинге</span></p>
        <p className="rule rule-4">Все фигуры по возрастанию:<br /><span className="co" style={{
          color: buttonColor, fontSize: '125%', filter: 'drop-shadow(0 3px 1px rgba(0, 0, 0, 0.7)) brightness(1.4) contrast(0.9)'
          }}><span style={{ fontSize: '115%', marginRight: '-3px' }}>●</span> ▲ ■ ⬟ ★ ♦ ♥ ⛰︎ 🟡💠☘ ♛</span> </p>
      </Div>

      <Button
        className="back-button"
        style={{ backgroundColor: buttonColor }}
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </Div>
  );
};

export default RulesScreen;