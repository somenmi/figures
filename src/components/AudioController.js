import { useEffect, useState, useRef, useCallback } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem('isMuted') === 'true'
  );
  const audioRef = useRef(null);

  // Мемоизированный обработчик первого взаимодействия
  const handleFirstInteraction = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play()
        .then(() => {
          console.log('Audio started after interaction');
        })
        .catch(e => {
          console.error('Audio play error after interaction:', e);
        });
    }
    document.removeEventListener('click', handleFirstInteraction);
  }, [isMuted]);

  // Инициализация аудио
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('/music/game-bg.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.06;
      
      const tryPlay = () => {
        if (!isMuted && audioRef.current) {
          audioRef.current.play()
            .then(() => {
              console.log('Audio started automatically');
            })
            .catch(e => {
              console.log('Autoplay prevented, will wait for interaction:', e);
              document.addEventListener('click', handleFirstInteraction);
            });
        }
      };

      tryPlay();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isMuted, handleFirstInteraction]); // Добавлены зависимости

  // Контроль состояния звука
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.log('Play prevented, waiting for interaction:', e);
        document.addEventListener('click', handleFirstInteraction);
      });
    }
  }, [isMuted, handleFirstInteraction]); // Добавлена зависимость

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('isMuted', newMuted.toString());
  };

  return (
    <div 
      onClick={toggleMute}
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