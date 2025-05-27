import { createRoot } from 'react-dom/client';
import App from './App';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

// Инициализация VK Bridge
bridge.send('VKWebAppInit')
  .then(() => bridge.send('VKWebAppAllowMessagesFromGroup'))
  .catch(() => { });

// Рендеринг приложения
const root = createRoot(document.getElementById('root'));
root.render(<App />);