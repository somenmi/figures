import React, { useEffect, useState } from 'react';
import { Button, Title, Div, Spinner } from '@vkontakte/vkui'; // Добавляем Spinner
import { getRatings } from '../utils/storage.js';
import '../RatingScreen.css';

const RatingScreen = ({ onBack, buttonColor }) => {
  const [ratings, setRatings] = useState({});
  const [selectedSize, setSelectedSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const sizes = [3, 4, 5];

  const processRatings = (rawRatings) => {
    if (!rawRatings) return [];

    const bestResults = {};

    rawRatings.forEach(player => {
      const userId = player.id || player.photo;
      if (!bestResults[userId] || player.score > bestResults[userId].score) {
        bestResults[userId] = { ...player };
      }
    });

    return Object.values(bestResults)
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  };

  useEffect(() => {
    const loadAllRatings = async () => {
      setIsLoading(true); // Включаем загрузку
      try {
        const ratingsData = {};
        for (const size of sizes) {
          const rawRatings = (await getRatings(size)) || [];
          ratingsData[size] = processRatings(rawRatings);
        }
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error loading ratings:', error);
      } finally {
        setIsLoading(false); // Выключаем загрузку
      }
    };

    loadAllRatings();
  }, []);

  // Добавляем отображение загрузки
  if (isLoading) {
    return (
      <Div className="rating-container">
        <Title level="1" className="rating-title">
          Рейтинг
        </Title>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
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
            style={{ '--button-color': buttonColor }}
            onClick={() => setSelectedSize(size)}
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      <div className="ratings-list">
        {ratings[selectedSize]?.length > 0 ? (
          ratings[selectedSize].map((player, index) => (
            <div key={`${player.id || player.photo}-${index}`} className="rating-item">
              <span className="rank">{index + 1}.</span>
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
              <span className="player">
                {player.name.split(' ')[0]}
              </span>
              <span className="score" style={{ color: buttonColor }}>
                {player.score}
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