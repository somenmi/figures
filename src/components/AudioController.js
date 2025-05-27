import { useState, useEffect } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState(null);

  const initAudio = () => {
    const newAudio = new Audio();
    
    // Добавляем оба источника для максимальной совместимости
    const sourceOgg = document.createElement('source');
    sourceOgg.src = process.env.PUBLIC_URL + '/music/game-bg-l.ogg';
    sourceOgg.type = 'audio/ogg';
    
    const sourceMp3 = document.createElement('source');
    sourceMp3.src = process.env.PUBLIC_URL + '/music/game-bg-l.mp3';
    sourceMp3.type = 'audio/mpeg';
    
    newAudio.appendChild(sourceOgg);
    newAudio.appendChild(sourceMp3);
    newAudio.loop = true;
    newAudio.volume = 0.3;
    
    setAudio(newAudio);
    return newAudio;
  };

  const toggleMute = () => {
    if (!audio) {
      const newAudio = initAudio();
      newAudio.play()
        .then(() => setIsMuted(false))
        .catch(e => console.error('Play failed:', e));
    } else if (isMuted) {
      audio.play()
        .then(() => setIsMuted(false))
        .catch(e => console.error('Play failed:', e));
    } else {
      audio.pause();
      setIsMuted(true);
    }
  };

  // Предзагрузка аудио при первом взаимодействии
  useEffect(() => {
    const handleInteraction = () => {
      if (!audio) {
        initAudio();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

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