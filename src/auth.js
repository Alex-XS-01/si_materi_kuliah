import { supabase } from './supabase.js';

export const auth = {
  async signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        await callback(event, session);
      })();
    });
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

export const profiles = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        mahasiswa(*),
        dosen(*)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createMahasiswaDetails(profileId, details) {
    const { data, error } = await supabase
      .from('mahasiswa')
      .insert({
        profile_id: profileId,
        ...details
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createDosenDetails(profileId, details) {
    const { data, error } = await supabase
      .from('dosen')
      .insert({
        profile_id: profileId,
        ...details
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const materials = {
  async searchMaterials(filters = {}) {
    let query = supabase
      .from('materi')
      .select(`
        *,
        profiles!materi_uploaded_by_fkey(nama, user_type)
      `)
      .order('created_at', { ascending: false });

    if (filters.program_studi) {
      query = query.eq('program_studi', filters.program_studi);
    }
    if (filters.semester) {
      query = query.eq('semester', filters.semester);
    }
    if (filters.bab) {
      query = query.ilike('bab', `%${filters.bab}%`);
    }
    if (filters.sub_bab) {
      query = query.ilike('sub_bab', `%${filters.sub_bab}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getMaterialById(id) {
    const { data, error } = await supabase
      .from('materi')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createMaterial(materialData) {
    const { data, error } = await supabase
      .from('materi')
      .insert(materialData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMaterial(id, updates) {
    const { data, error } = await supabase
      .from('materi')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMaterial(id) {
    const { error } = await supabase
      .from('materi')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
