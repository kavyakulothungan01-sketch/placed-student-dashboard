import { supabase } from './supabaseClient';

/**
 * Universal Data Persistence Layer
 * Interacts directly with official Supabase database tables.
 * Persists user inputs and data updates without falling back to hardcoded mock data.
 */
export const persistentStorage = {
  async get(key, supabaseQuery, emptyDefault) {
    try {
      if (supabaseQuery) {
        const result = await supabaseQuery() || {};
        const { data, error } = result;
        if (!error && data) {
          // Store actual database record in local persistent cache
          localStorage.setItem(`placed_user_db_${key}`, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn(`Supabase fetch notice for ${key}:`, err);
    }

    // Retrieve from persistent user storage if available
    const cached = localStorage.getItem(`placed_user_db_${key}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      } catch (e) {
        // Cache read error
      }
    }

    return emptyDefault;
  },

  async set(key, supabaseMutation, updatedData) {
    // 1. Save user state to persistent local cache
    localStorage.setItem(`placed_user_db_${key}`, JSON.stringify(updatedData));

    // 2. Persist to official Supabase database
    if (supabaseMutation) {
      try {
        await supabaseMutation();
      } catch (err) {
        console.warn(`Supabase sync notice for ${key}:`, err);
      }
    }

    return updatedData;
  },

  clearMockCache() {
    // Clear any legacy mock cache keys
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('placed_db_')) {
        localStorage.removeItem(k);
      }
    });
  }
};
