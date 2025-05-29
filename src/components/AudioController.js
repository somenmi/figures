import { useState, useRef, useEffect } from 'react';
import { Icon24Volume, Icon24Mute } from '@vkontakte/icons';

const AudioController = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioRef.current) {
        const audio = new Audio();
        audio.src = `${process.env.PUBLIC_URL}/music/game.mp3`;
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'none';
        audioRef.current = audio;
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMute = async () => {
    if (!audioRef.current) return;

    try {
      if (isMuted) {
        await audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.warn('Playback failed:', error);
      // Для VK
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

  return (
    <div
      onClick={toggleMute}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        cursor: 'pointer',
        background: 'rgba(0, 0, 0, 0.18)',
        borderRadius: '50%',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '35%',
      }}
    >
      {isMuted ? (
        <Icon24Mute fill="#fff" width={24} height={24} />
      ) : (
        <Icon24Volume fill="#fff" width={24} height={24} />
      )}
    </div>
  );
};

export default AudioController;