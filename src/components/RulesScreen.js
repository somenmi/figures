import React from 'react';
import { Button, Title } from '@vkontakte/vkui';

const RulesScreen = ({ onBack }) => {
  return (
    <div className="screen-container">
      <Title level="1" style={{ marginBottom: '20px', scale: '200%' }}>Правила игры</Title>
      
      <div style={{ 
        maxWidth: '500px',
        marginBottom: '30px',
        lineHeight: '1.6',
        textAlign: 'center'
      }}>
        <p style={{color: '#baff4a' }}>① Используйте стрелки или свайпы для перемещения фигур</p>
        <p style={{color: '#ffa74a' }}>② Одинаковые фигуры объединяются в следующую по уровню</p>
        <p style={{color: '#ff4a62' }}>③ Цель - получить фигуру 2048</p>
      </div> 

      <Button 
        className="menu-button"
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </div>
  );
};

export default RulesScreen;