import { useState, useEffect, useCallback } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Инициализация аудио
  useEffect(() => {
    const audioElement = new Audio();
    const sourceOgg = document.createElement('source');
    sourceOgg.src = process.env.PUBLIC_URL + '/music/game-bg-l.ogg';
    sourceOgg.type = 'audio/ogg';
    
    const sourceMp3 = document.createElement('source');
    sourceMp3.src = process.env.PUBLIC_URL + '/music/game-bg-l.mp3';
    sourceMp3.type = 'audio/mpeg';
    
    audioElement.appendChild(sourceOgg);
    audioElement.appendChild(sourceMp3);
    audioElement.loop = true;
    audioElement.volume = 0.3;
    audioElement.preload = 'auto';
    
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  // Обработчик взаимодействия пользователя
  useEffect(() => {
    const handleInteraction = () => {
      if (!isUserInteracted) {
        setIsUserInteracted(true);
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [isUserInteracted]);

  // Безопасная функция воспроизведения
  const playAudio = useCallback(async () => {
    if (!audio) return false;

    try {
      await audio.play();
      return true;
    } catch (err) {
      // Попробуем запросить разрешение в VK
      if (window.vkBridge) {
        try {
          await window.vkBridge.send('VKWebAppAllowNotifications');
          await audio.play();
          return true;
        } catch (vkErr) {
          console.warn('VK audio permission denied');
          return false;
        }
      }
      return false;
    }
  }, [audio]);

  const toggleMute = useCallback(async () => {
    if (!audio) return;

    if (isMuted) {
      if (!isUserInteracted) return;
      
      const success = await playAudio();
      setIsMuted(!success);
    } else {
      audio.pause();
      setIsMuted(true);
    }
  }, [audio, isMuted, isUserInteracted, playAudio]);

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