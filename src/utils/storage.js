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
    const ratings = await getRatings(gridSize);
    const user = await bridge.send('VKWebAppGetUserInfo');
    
    const newEntry = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      photo: user.photo_100,
      score
    };

    const updated = [...ratings, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    await bridge.send('VKWebAppStorageSet', {
      key: `ratings_${gridSize}`,
      value: JSON.stringify(updated)
    });
  } catch (e) {
    console.error('Rating save error:', e);
  }
};

export const getRatings = async (gridSize) => {
  try {
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [`ratings_${gridSize}`]
    });
    return data.keys[0] ? JSON.parse(data.keys[0].value) : [];
  } catch (e) {
    console.error('Rating load error:', e);
    return [];
  }
};