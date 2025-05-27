import { useState } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState(null);

  const toggleMute = () => {
    if (!audio) {
      // Создаем аудио только при первом клике
      const newAudio = new Audio('/music/game-bg.mp3');
      newAudio.loop = true;
      newAudio.volume = 0.3;
      newAudio.play().catch(e => console.error('Play error:', e));
      setAudio(newAudio);
      setIsMuted(false);
    } else if (isMuted) {
      audio.play().catch(e => console.error('Play error:', e));
      setIsMuted(false);
    } else {
      audio.pause();
      setIsMuted(true);
    }
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