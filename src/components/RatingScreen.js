import React, { useEffect, useState } from 'react';
import { Button, Title, Div } from '@vkontakte/vkui';
import { getRatings } from '../utils/storage';
import '../RatingScreen.css';

const RatingScreen = ({ onBack, buttonColor }) => {
  const [ratings, setRatings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sizes = [3, 4, 5];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getRatings(selectedSize);
        setRatings(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('Не удалось загрузить рейтинг');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSize]);

  if (!ratings) return null;

  if (isLoading) {
    return (
      <Div className="rating-container">
        <Title level="1">Рейтинг</Title>
        <div>Загрузка...</div>
      </Div>
    );
  } // size="large" style={{ margin: '20px 0' }}

  return (
    <Div className="rating-container">
      <Title level="1">Рейтинг</Title>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}

      <div className="size-selector">
        {sizes.map(size => (
          <Button
            key={size}
            style={{
              backgroundColor: buttonColor,
              opacity: selectedSize === size ? 1 : 0.7
            }}
            onClick={() => setSelectedSize(size)}
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      <div className="ratings-list">
        {Array.isArray(ratings) && ratings.length > 0 ? (
          ratings.map((player, index) => (
            <div key={player.user_id || index} className="rating-item">
              <span className="rank">{index + 1}.</span>
              <img
                src={player.photo_url}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  margin: '0 10px'
                }}
              />
              <span className="player-name">
                {player.name || 'Игрок'}
              </span>
              <span className="score">
                {player.score}
              </span>
            </div>
          ))
        ) : (
          <div style={{ margin: '20px 0' }}>
            Пока нет рейтингов для {selectedSize}x{selectedSize}
          </div>
        )}
      </div>

      <Button
        size="l"
        onClick={onBack}
        style={{
          backgroundColor: buttonColor,
          marginTop: 20
        }}
      >
        Назад
      </Button>
    </Div>
  );
};

export default RatingScreen;