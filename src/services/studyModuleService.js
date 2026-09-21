import { supabase } from '../lib/supabaseClient.js';
import { readinessService } from './readinessService.js';

/**
 * Structured Study Modules Service
 * Directly connected to the live Supabase `study_modules` database table.
 * Strictly reflects real-time database state without persisting deleted records in cache.
 */
export const studyModuleService = {
  /**
   * Fetch all study modules live from Supabase in ascending alphabetical order.
   * If the table or records are deleted in Supabase, this returns [] immediately.
   */
  async getStudyModules() {
    try {
      // 1. Live query to Supabase study_modules table
      const { data, error } = await supabase
        .from('study_modules')
        .select('*')
        .order('title', { ascending: true });

      // If table was deleted, dropped, or relation does not exist
      if (error) {
        console.warn('Supabase study_modules query returned error:', error.message);
        // Clear any stale local cache so deleted table does not persist in UI
        try {
          localStorage.removeItem('placed_user_db_study_modules_catalog');
        } catch (_) {}
        return [];
      }

      // If database returned 0 rows (all records were deleted from table)
      if (!data || data.length === 0) {
        // Clear any old cached items
        try {
          localStorage.removeItem('placed_user_db_study_modules_catalog');
        } catch (_) {}
        return [];
      }

      // Database has live records
      const mapped = data.map(m => ({
        id: m.id,
        title: m.title,
        subject: m.subject,
        subjectId: m.subject_id,
        description: m.description,
        s1GapTag: m.s1_gap_tag,
        isRecommended: m.is_recommended,
        recommendationReason: m.recommendation_reason,
        createdAt: m.created_at,
        fileDetails: m.file_details || '—'
      }));

      return this._enrichWithDeficits(mapped);
    } catch (err) {
      console.error('Failed to query Supabase study_modules:', err);
      // Clean up cache to prevent resurrecting deleted database state
      try {
        localStorage.removeItem('placed_user_db_study_modules_catalog');
      } catch (_) {}
      return [];
    }
  },

  async _enrichWithDeficits(modules) {
    if (!modules || modules.length === 0) return [];
    try {
      const deficits = await readinessService.getSkillGaps();
      const topDeficit = deficits?.find(d => d.gap < 0);
      if (topDeficit) {
        return modules.map(m => {
          const matchesDeficit = (m.subject && m.subject.toLowerCase().includes(topDeficit.name.toLowerCase())) || 
                                (m.subjectId && topDeficit.name.toLowerCase().includes(m.subjectId.toLowerCase()));
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
