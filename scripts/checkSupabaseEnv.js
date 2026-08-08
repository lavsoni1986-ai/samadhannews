// scripts/checkSupabaseEnv.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined');
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'undefined');
