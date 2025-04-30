import React, { useEffect, useState } from 'react';
import { Button, Title, Div } from '@vkontakte/vkui';
import { getRatings } from '../utils/storage';
import '../RatingScreen.css'; // Создадим этот файл

const RatingScreen = ({ onBack, buttonColor }) => {
  const [ratings, setRatings] = useState({});
  const [selectedSize, setSelectedSize] = useState(4);
  const sizes = [4, 6, 8];

  useEffect(() => {
    const loadAllRatings = async () => {
      const ratingsData = {};
      for (const size of sizes) {
        ratingsData[size] = (await getRatings(size)) || [];
      }
      setRatings(ratingsData);
    };
    loadAllRatings();
  }, []);

  return (
    <Div className="rating-container">
      <Title level="1" className="rating-title">
        Таблица рекордов
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
            <div key={index} className="rating-item">
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
              <span className="player">{player.name}</span>
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
        className="back-button"
        style={{ backgroundColor: buttonColor }}
        onClick={onBack}
      >
        Назад в меню
      </Button>
    </Div>
  );
};

export default RatingScreen;