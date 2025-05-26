import React, { useEffect, useState } from 'react';
import { Button, Title, Div, Spinner } from '@vkontakte/vkui';
import { getTopRatings } from '../utils/storage';
import '../RatingScreen.css';

const RatingScreen = ({ onBack, buttonColor }) => {
  const [ratings, setRatings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const sizes = [3, 4, 5];

  useEffect(() => {
    let isMounted = true;

    const loadRatings = async () => {
      try {
        const data = await getTopRatings(selectedSize);
        if (isMounted) {
          setRatings(data);
        }
      } catch (error) {
        console.error('Error loading ratings:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRatings();

    return () => {
      isMounted = false;
    };
  }, [selectedSize]);

  if (isLoading) {
    return (
      <Div className="rating-container">
        <Title level="1" className="rating-title">
          Рейтинг
        </Title>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Spinner size="regular" />
        </div>
      </Div>
    );
  }

  return (
    <Div className="rating-container">
      <Title level="1" className="rating-title">
        尸仨认丁凵廾厂
      </Title>

      <div className="size-selector">
        {sizes.map(size => (
          <Button
            key={size}
            className={`size-button ${selectedSize === size ? 'active' : ''}`}
            style={{ backgroundColor: buttonColor }}
            onClick={() => setSelectedSize(size)}
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      <div className="ratings-list">
        {ratings[selectedSize]?.length > 0 ? (
          ratings[selectedSize].map((player, index) => (
            <div key={`${player.id || index}`} className="rating-item">
              <span className="rank">{index + 1}.</span>
              {player.photo && (
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
              )}
              <span className="player">
                {player.name?.split(' ')[0] || 'Аноним'}
              </span>
              <span className="score" style={{ color: buttonColor }}>
                {player.score || 0}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-rating">
            Нет результатов для {selectedSize}x{selectedSize}
          </div>
        )}
      </div>

      <Button
        className="back-button1"
        style={{ backgroundColor: buttonColor }}
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </Div>
  );
};

export default RatingScreen;