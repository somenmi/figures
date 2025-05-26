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

    // 1. Сначала получаем текущий рекорд
    const { data: existing } = await supabase
      .from('ratings')
      .select('score')
      .eq('user_id', user.id)
      .eq('grid_size', gridSize)
      .single();

    // 2. Обновляем только если новый рекорд выше
    if (!existing || score > existing.score) {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          photo_url: user.photo_100,
          score,
          grid_size: gridSize,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,grid_size' // Указываем составной ключ
        });

      if (error) throw error;
      console.log('Рейтинг обновлён');
    } else {
      console.log('Текущий рекорд выше, не обновляем');
    }
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
};

export const getRatings = async (gridSize) => {
  try {
    console.log('Пытаюсь извлечь из Supabase...');
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('grid_size', gridSize)
      .order('score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase ОШИБКА:', error);
      return [];
    }

    console.log('Полученные данные:', data);
    return data;
  } catch (e) {
    console.error('Глобальная ошибка выборки:', e);
    return [];
  }
};

export const getTopRatings = async (gridSize) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('grid_size', gridSize)
      .order('score', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Ошибка загрузки рейтинга:', e);
    return [];
  }
};

console.log('Текущие ограничения таблицы:');
const { data: constraints } = await supabase
  .rpc('get_constraints', { table_name: 'ratings' });
console.log(constraints);