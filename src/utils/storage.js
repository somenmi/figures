import bridge from '@vkontakte/vk-bridge';

export const saveGame = async (gridSize, data) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    await bridge.send('VKWebAppStorageSet', {
      key: `game_${gridSize}_${user.id}`,
      value: JSON.stringify(data)
    });
  } catch (e) {
    console.error('Save error:', e);
  }
};

export const loadGame = async (gridSize) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [`game_${gridSize}_${user.id}`]
    });
    return data.keys[0]?.value ? JSON.parse(data.keys[0].value) : null;
  } catch (e) {
    console.error('Load error:', e);
    return null;
  }
};

export const saveRating = async (gridSize, score) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    // Пытаемся сохранить через API
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: `${user.first_name} ${user.last_name}`,
          photo: user.photo_100,
          score,
          gridSize,
        }),
      });

      if (!response.ok) throw new Error('API failed');
      return;
    } catch (apiError) {
      console.error('API error:', apiError);
    }

    // Fallback на VK хранилище
    const ratings = await getRatings(gridSize);
    const newEntry = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      photo: user.photo_100,
      score
    };

    const updated = [...ratings.filter(r => r.id !== user.id), newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    await bridge.send('VKWebAppStorageSet', {
      key: `ratings_${gridSize}`,
      value: JSON.stringify(updated)
    });
  } catch (e) {
    console.error('Save rating error:', e);
  }
};

export const getRatings = async (gridSize) => {
  try {
    // Пытаемся получить с API
    try {
      const response = await fetch(`/api/ratings?size=${gridSize}`);
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (apiError) {
      console.error('API error:', apiError);
    }

    // Fallback на VK хранилище
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [`ratings_${gridSize}`]
    });

    const raw = data.keys[0]?.value;
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Get ratings error:', e);
    return [];
  }
};