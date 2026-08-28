import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { readinessService } from './readinessService';

/**
 * Structured Study Modules Service
 * Evaluates real S-1 skill gap metrics to provide personalized recommendations.
 */
export const studyModuleService = {
  /**
   * Fetch all study modules with sequential lessons from database.
   */
  async getStudyModules() {
    const modules = await persistentStorage.get(
      'study_modules_catalog',
      async () => {
        const { data, error } = await supabase
          .from('study_modules')
          .select('*, study_lessons(*)');
        if (error) throw error;
        if (!data) return [];
        return data.map(m => ({
          id: m.id,
          title: m.title,
          subject: m.subject,
          subjectId: m.subject_id,
          description: m.description,
          s1GapTag: m.s1_gap_tag,
          isRecommended: m.is_recommended,
          recommendationReason: m.recommendation_reason,
          lessons: (m.study_lessons || []).map(l => ({
            id: l.id,
            title: l.title,
            status: l.status || 'locked',
            classId: l.class_id
          }))
        }));
      },
      []
    );

    // Dynamic S-1 Skill Gap recommendation enrichment
    try {
      const deficits = await readinessService.getSkillGaps();
      const topDeficit = deficits.find(d => d.gap < 0);
      if (topDeficit && modules.length > 0) {
        return modules.map(m => {
          const matchesDeficit = m.subject.toLowerCase().includes(topDeficit.name.toLowerCase()) || 
                                topDeficit.name.toLowerCase().includes(m.subjectId.toLowerCase());
          if (matchesDeficit) {
            return {
              ...m,
              isRecommended: true,
              s1GapTag: `S-1 Deficit (${topDeficit.gapDisplay})`,
              recommendationReason: `Recommended to address identified ${topDeficit.name} skill gaps.`
            };
          }
          return m;
        });
      }
    } catch (e) {
      console.warn('Error dynamically tagging study modules with S-1 deficit', e);
    }

    return modules;
  },

  /**
   * Fetch S-1 skill gap recommended modules.
   */
  async getRecommendedModules() {
    const modules = await this.getStudyModules();
    return modules.filter(m => m.isRecommended);
  }
};
