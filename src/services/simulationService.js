import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Recruitment Simulations Service
 */
export const simulationService = {
  /**
   * Fetch active multi-stage recruitment trial simulations.
   */
  async getSimulations() {
    return persistentStorage.get(
      'student_simulations',
      async () => {
        const { data, error } = await supabase
          .from('student_simulations')
          .select('*');
        if (error) throw error;
        return data;
      },
      []
    );
  }
};
