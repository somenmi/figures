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
        尸仨认丁凵廾厂
      </Title>
      
      <div className="size-selector">
        {sizes.map(size => (
          <Button
            key={size}
            className={`size-button2 ${selectedSize === size ? 'active' : ''}`}
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
            <div key={index} className="rating-item">
              <span className="rank">{index + 1}.</span>
              <span className="player">Игрок #{index + 1}</span>
              <span className="score" style={{ color: buttonColor }}>
                {player.score}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-rating">
            Пока нет результатов для {selectedSize}x{selectedSize}
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