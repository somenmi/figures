import bridge from '@vkontakte/vk-bridge';
import supabase from '../utils/supabase';

export const saveGame = async (size, gameData) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    await bridge.send('VKWebAppStorageSet', {
      key: `saved_game_${size}_${user.id}`,
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
      keys: [`saved_game_${size}_${user.id}`]
    });
    return data.keys[0]?.value ? JSON.parse(data.keys[0].value) : null;
  } catch (e) {
    console.error('Load game error:', e);
    return null;
  }
};

export const saveRating = async (gridSize, score) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    const { error } = await supabase // Используем импортированный supabase
      .from('ratings')
      .upsert({
        user_id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        photo_url: user.photo_100,
        score,
        grid_size: gridSize,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,grid_size'
      });

    if (error) throw error;
  } catch (e) {
    console.error('Save rating error:', e);
  }
};

export const getRatings = async (gridSize) => {
  try {
    console.log('Trying to fetch from Supabase...');
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('grid_size', gridSize)
      .order('score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log('Received data:', data);
    return data;
  } catch (e) {
    console.error('Global fetch error:', e);
    return [];
  }
};