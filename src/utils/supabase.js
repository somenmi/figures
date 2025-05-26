import { createClient } from '@supabase/supabase-js';

// Для Create React App (не Vite)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not configured!');
    alert('Ошибка конфигурации. Проверьте настройки Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);