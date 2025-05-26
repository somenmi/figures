import React, { useState, useEffect } from 'react';
import { Button, Title, Div } from '@vkontakte/vkui';
import { getRatings } from '../utils/storage';
import '../RatingScreen.css';

const RatingScreen = ({ onBack, buttonColor }) => {
  const [ratings, setRatings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(3);
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

  if (isLoading) {
    return (
      <Div className="center-place" style={{ textAlign: 'center', fontSize: '600%', opacity: '65%' }}>
        <div>⌛</div>
      </Div>
    );
  }

  if (!ratings) return null;

  return (
    <Div className="rating-container">
      <Title className='text-logo' level="1" style={{ margin: '30px 0 26px 0', fontSize: '240%', color: buttonColor }}>尸仨认丁凵廾厂</Title>

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
          ratings.map((player, index) => {
            const isTopThree = index < 3;
            const placeClass =
              index === 0 ? 'first-place' :
                index === 1 ? 'second-place' :
                  index === 2 ? 'third-place' : '';

            const bgColors = {
              'first-place': 'rgb(255, 0, 0, 0.1)',
              'second-place': 'rgb(255, 128, 0, 0.1)',
              'third-place': 'rgb(255, 191, 0, 0.1)'
            };

            return (
              <div key={player.user_id || index}
                className={`rating-item ${isTopThree ? 'top-three-item' : ''}`}
                style={{
                  backgroundColor: isTopThree ? bgColors[placeClass] : 'rgba(255, 255, 255, 0.1)'
                }}>
                <span className={`rank ${placeClass}`}>{index + 1}</span>
                <img
                  src={player.photo_url}
                  alt=""
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    margin: '0 4.5px'
                  }}
                />
                <span className={`player-name ${placeClass}`}>
                  {player.name || 'Игрок'}
                </span>
                <span className={`score ${placeClass}`}>
                  {player.score}
                </span>
              </div>
            );
          })
        ) : (
          <div className='center-place' style={{ margin: '20px 0', color: '#cfcfcf', fontSize: '120%' }}>
            Для {selectedSize}x{selectedSize} пока никого
          </div>
        )}
      </div>

      <Button
        size="l"
        onClick={onBack}
        style={{
          backgroundColor: buttonColor,
          marginTop: 6,
          marginBottom: 28,
        }}
      >
        Назад
      </Button>
    </Div>
  );
};

export default RatingScreen;