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
  },

  /**
   * Fetch all questions for an assessment from Supabase, ordered by question_order.
   */
  async getAssessmentQuestions(assessmentId) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_order', { ascending: true });

    if (error) {
      console.error(`Error fetching questions for ${assessmentId}:`, error);
      throw error;
    }
    return data || [];
  },

  /**
   * Create an in-progress assessment attempt record for the authenticated user.
   */
  async createAssessmentAttempt(assessmentId, totalMarks = 20) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication required: No active session found. Please sign in to start the assessment.');
    }

    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        started_at: new Date().toISOString(),
        total_marks: totalMarks,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment attempt in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Insert student answers into student_assessment_answers.
   */
  async saveAssessmentAnswers(answers) {
    if (!answers || answers.length === 0) return [];
    const { data, error } = await supabase
      .from('student_assessment_answers')
      .insert(answers)
      .select();

    if (error) {
      console.error('Error saving student answers in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Finalize the assessment attempt with score, percentage, and completed status.
   */
  async completeAssessmentAttempt(attemptId, { score, totalMarks, percentage }) {
    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .update({
        status: 'completed',
        submitted_at: new Date().toISOString(),
        score,
        total_marks: totalMarks,
        percentage
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error('Error updating assessment attempt completion in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Fetch the authenticated user's latest completed attempt for an assessment.
   */
  async getLatestAssessmentAttempt(assessmentId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('assessment_id', assessmentId)
      .eq('status', 'completed')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching latest attempt for ${assessmentId}:`, error);
      return null;
    }
    return data;
  }
};
