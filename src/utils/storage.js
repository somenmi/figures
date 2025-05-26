import bridge from '@vkontakte/vk-bridge';

// Ключ для общего рейтинга (один для всех)
const RATING_KEY = 'global_ratings';
const SAVE_GAME_KEY = 'saved_game';

// Функции для рейтинга (которые мы уже добавили)
export const saveRating = async (gridSize, score) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    const userEntry = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      photo: user.photo_100,
      score,
      gridSize,
      timestamp: Date.now()
    };

    await bridge.send('VKWebAppStorageSet', {
      key: `user_${user.id}_rating`,
      value: JSON.stringify(userEntry)
    });

    const currentRatings = await getRatings(gridSize);
    const updated = [...currentRatings.filter(r => r.id !== user.id), userEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    await bridge.send('VKWebAppStorageSet', {
      key: `${RATING_KEY}_${gridSize}`,
      value: JSON.stringify(updated)
    });

  } catch (e) {
    console.error('Save rating error:', e);
  }
};

export const getRatings = async (gridSize) => {
  try {
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [`${RATING_KEY}_${gridSize}`]
    });

    const raw = data.keys[0]?.value;
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Get ratings error:', e);
    return [];
  }
};

export const getTopRatings = async (gridSize) => {
  return await getRatings(gridSize);
};

// Добавляем обратно функции для сохранения игры
export const saveGame = async (size, gameData) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    await bridge.send('VKWebAppStorageSet', {
      key: `${SAVE_GAME_KEY}_${size}_${user.id}`,
      value: JSON.stringify(gameData)
    });
    return true;
  } catch (e) {
    console.error('Save game error:', e);
    return false;
  }
};

export const loadGame = async (size) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [`${SAVE_GAME_KEY}_${size}_${user.id}`]
    });
    return data.keys[0]?.value ? JSON.parse(data.keys[0].value) : null;
  } catch (e) {
    console.error('Load game error:', e);
    return null;
  }
};