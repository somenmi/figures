import { useState, useEffect, useRef } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const isInitialized = useRef(false);

  // Инициализация при первом взаимодействии
  const initAudio = () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const audio = new Audio();
    audio.src = `${process.env.PUBLIC_URL}/music/game.mp3`;
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    audio.load();
    audioRef.current = audio;
  };

  const handleClick = async () => {
    try {
      initAudio();
      const audio = audioRef.current;

      if (isMuted) {
        // Попытка воспроизведения
        await audio.play();
        setIsMuted(false);
      } else {
        audio.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.warn('Audio error:', error);
      // Для VK Mini Apps
      if (window.vkBridge) {
        try {
          await window.vkBridge.send('VKWebAppAllowNotifications');
          await audioRef.current.play();
          setIsMuted(false);
        } catch (vkError) {
          console.warn('VK audio permission denied');
        }
      }
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isMuted ? (
        <Icon24Mute fill="#fff" width={28} height={28} />
      ) : (
        <Icon24Volume fill="#fff" width={28} height={28} />
      )}
    </div>
  );
};

export default AudioController;