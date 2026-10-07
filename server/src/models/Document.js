const { getSupabase } = require('../config/db');

const Document = {
  async create({ userId, fileName, language, analysis }) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        file_name: fileName,
        language,
        analysis
      })
      .select('id, user_id, file_name, language, analysis, created_at')
      .single();

    if (error) {
      throw new Error(`Database error creating document: ${error.message}`);
    }

    return {
      id: data.id,
      fileName: data.file_name,
      language: data.language,
      analysis: data.analysis,
      createdAt: data.created_at
    };
  },

  async findByUserId(userId) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, user_id, file_name, language, analysis, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error retrieving user documents: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      fileName: row.file_name,
      language: row.language,
      analysis: row.analysis,
      createdAt: row.created_at
    }));
  },

  async findByIdAndUserId(id, userId) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, user_id, file_name, language, analysis, created_at')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error retrieving document by ID: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      fileName: data.file_name,
      language: data.language,
      analysis: data.analysis,
      createdAt: data.created_at
    };
  },

  async deleteByIdAndUserId(id, userId) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(`Database error deleting document: ${error.message}`);
    }

    return Boolean(data);
  }
};

module.exports = Document;
