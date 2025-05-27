import { useState, useEffect } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem('isMuted') === 'true'
  );
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Создаем аудио элемент только при взаимодействии
    const handleFirstInteraction = () => {
      const newAudio = new Audio();
      newAudio.src = '/music/game-bg.mp3';
      newAudio.loop = true;
      newAudio.volume = 0.3;
      setAudio(newAudio);
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Audio play error:', e));
    }
  }, [isMuted, audio]);

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