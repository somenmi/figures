import { createClient } from '@supabase/supabase-js';

// Правильное объявление переменных
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Проверка переменных окружения
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured!');
  throw new Error('Supabase credentials not configured');
}

// Создание и экспорт клиента
const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true
  }
});

export default supabaseClient; // Исправленный экспорт