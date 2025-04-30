import { Button, Popover } from '@vkontakte/vkui';
import { useState } from 'react';

const colors = ['#FF5722', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#795548'];

export const ColorPicker = ({ onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Popover
      action="click"
      shown={showPicker}
      onShownChange={setShowPicker}
      content={
        <div style={{ 
          padding: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8
        }}>
          {colors.map(color => (
            <div
              key={color}
              onClick={() => {
                onColorChange(color);
                setShowPicker(false);
              }}
              style={{
                width: 40,
                height: 40,
                backgroundColor: color,
                borderRadius: 30,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      }
    >
      <Button 
        size="l" 
        mode="outline"
        style={{ margin: '10px 0' }}
      >
        Выбрать цвет кнопок
      </Button>
    </Popover>
  );
};