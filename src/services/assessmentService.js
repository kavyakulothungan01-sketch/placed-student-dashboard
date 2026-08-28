import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Diagnostic Assessments & Benchmark Tests Service
 */
export const assessmentService = {
  /**
   * Fetch all diagnostic assessments.
   */
  async getAssessments() {
    return persistentStorage.get(
      'student_assessments',
      async () => {
        const { data, error } = await supabase
          .from('student_assessments')
          .select('*');
        if (error) throw error;
        return data;
      },
      []
    );
  }
};
