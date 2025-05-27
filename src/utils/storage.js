import bridge from '@vkontakte/vk-bridge';
import supabase from '../utils/supabase';

export const saveRating = async (gridSize, score) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    // 1. Проверяем текущий рекорд пользователя
    const { data: existing } = await supabase
      .from('ratings')
      .select('score')
      .eq('user_id', user.id)
      .eq('grid_size', gridSize)
      .single();

    // 2. Если рекорд не улучшен - выходим
    if (existing && existing.score >= score) {
      return;
    }

    // 3. Сохраняем/обновляем результат
    const { error: upsertError } = await supabase
      .from('ratings')
      .upsert({
        user_id: user.id,
        name: `${user.first_name}`,
        photo_url: user.photo_100,
        score,
        grid_size: gridSize,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,grid_size'
      });

    if (upsertError) throw upsertError;

    // 4. Удаляем результаты ниже ТОП-10
    const { data: allRatings } = await supabase
      .from('ratings')
      .select('id, score')
      .eq('grid_size', gridSize)
      .order('score', { ascending: false });

    if (allRatings && allRatings.length > 10) {
      const idsToDelete = allRatings.slice(10).map(item => item.id);

      const { error: deleteError } = await supabase
        .from('ratings')
        .delete()
        .in('id', idsToDelete);

      if (deleteError);
    }

  } catch (e) {
  }
};

export const getRatings = async (gridSize) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('grid_size', gridSize)
      .order('score', { ascending: false })
      .limit(100);

    if (error) return [];

    return data;
  } catch (e) {
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
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Ошибка загрузки рейтинга:', e);
    return [];
  }
};

export const clearAllSavedGames = async () => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    const sizes = [3, 4, 5];

    for (const size of sizes) {
      await bridge.send('VKWebAppStorageSet', {
        key: `saved_game_${size}_${user.id}`,
        value: null
      });
    }
    console.log('Все сохранения удалены');
  } catch (e) {
    console.error('Ошибка очистки:', e);
  }
};

/*console.log('Текущие ограничения таблицы:');
const { data: constraints } = await supabase
  .rpc('get_constraints', { table_name: 'ratings' });
console.log(constraints);*/