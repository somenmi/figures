import { createRoot } from 'react-dom/client';
import App from './App';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

// Инициализация VK Bridge
bridge.send('VKWebAppInit').catch(console.log);

// Рендеринг приложения
const root = createRoot(document.getElementById('root'));
root.render(<App />);

console.log('App mounted!');
if (!document.getElementById('root').firstChild) {
  console.error('Root element is empty! Check your App component');
}