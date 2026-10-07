const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

const initSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    if (process.env.NODE_ENV === 'test') {
      // In tests, a mock client will be injected or used
      return null;
    }
    console.warn('⚠️ SUPABASE_URL or SUPABASE_SECRET_KEY is missing from environment variables.');
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return supabaseClient;
};

const getSupabase = () => {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
};

const setSupabaseClient = (client) => {
  supabaseClient = client;
};

module.exports = {
  getSupabase,
  setSupabaseClient
};
