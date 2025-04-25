import React, { useEffect, useState } from 'react';
import { Button, Title } from '@vkontakte/vkui';
import { getRatings } from '../utils/storage';

const RatingScreen = ({ gridSize, onBack }) => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const data = await getRatings(gridSize);
        setRatings(data);
      } catch (error) {
        console.error('Ошибка загрузки рейтинга:', error);
      }
    };

    loadRatings();
  }, [gridSize]);

  return (
    <div style={{ 
      padding: '20px',
      textAlign: 'center'
    }}>
      <Title level="1" style={{ marginBottom: '20px' }}>
        Рейтинг {gridSize}x{gridSize}
      </Title>
      
      {ratings.length > 0 ? (
        <div style={{ 
          maxWidth: '500px',
          margin: '0 auto 20px',
          textAlign: 'left'
        }}>
          {ratings.map((player, index) => (
            <div key={player.id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}>
              <span style={{ 
                width: '30px',
                fontWeight: 'bold'
              }}>
                {index + 1}.
              </span>
              <img 
                src={player.photo} 
                alt="" 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  margin: '0 15px'
                }} 
              />
              <span style={{ flexGrow: 1 }}>{player.name}</span>
              <span style={{ fontWeight: 'bold' }}>{player.score}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Рейтинг пока пуст</p>
      )}

      <Button 
        size="l"
        onClick={onBack}
        style={{ marginTop: '20px' }}
      >
        Назад в меню
      </Button>
    </div>
  );
};

export default RatingScreen;