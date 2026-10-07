const { getSupabase } = require('../config/db');

const User = {
  async findByEmail(email) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      throw new Error(`Database error finding user by email: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error finding user by ID: ${error.message}`);
    }

    return data;
  },

  async create({ name, email, passwordHash }) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash
      })
      .select('id, name, email, created_at')
      .single();

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        const err = new Error('Email is already registered.');
        err.statusCode = 409;
        throw err;
      }
      throw new Error(`Database error creating user: ${error.message}`);
    }

    return data;
  }
};

module.exports = User;
