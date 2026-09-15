// ============================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================
// 1. Crie um projeto em https://supabase.com
// 2. Vá em Project Settings > API
// 3. Copie a "Project URL" e a chave "anon public"
// 4. Cole nos campos abaixo
// ============================================================

const SUPABASE_URL = "https://gzusfiexmyzriqlejwwr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3p67y5uRfSl4-ymYUklJZw_5z8Ui6NR";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
