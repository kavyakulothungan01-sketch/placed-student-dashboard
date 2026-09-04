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
        if (error) {
          console.error('Error fetching student_assessments:', error);
          throw error;
        }
        if (!data || !Array.isArray(data)) return [];
        return data.map((item) => ({
          ...item,
          questionCount: item.questionCount ?? item.question_count,
          statusBadge: item.statusBadge ?? item.status_badge,
          isActive: item.isActive !== undefined ? item.isActive : (item.is_active !== undefined ? item.is_active : true)
        }));
      },
      []
    );
  }
};
