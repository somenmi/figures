import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import bridge from '@vkontakte/vk-bridge';
import { VK_APP_ID } from './vkConfig';

// Инициализация
bridge.send('VKWebAppInit').then(() => {
  console.log('VK Bridge initialized');
});

// Для тестирования вне VK
if (!window.vkBridge) {
  window.vkBridge = {
    send: (method, params) => {
      console.log(`VK Bridge mock: ${method}`, params);
      return Promise.resolve({});
    },
    subscribe: (fn) => fn({}),
    supports: () => true
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
