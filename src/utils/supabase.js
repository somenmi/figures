import { createClient } from '@supabase/supabase-js';

// Для разработки локально
const localEnv = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY
};

if (!localEnv.supabaseUrl || !localEnv.supabaseKey) {
    console.error('Supabase credentials not found!');
    alert('Ошибка конфигурации. Пожалуйста, сообщите разработчику.');
}

export const supabase = createClient(
    localEnv.supabaseUrl,
    localEnv.supabaseKey
);