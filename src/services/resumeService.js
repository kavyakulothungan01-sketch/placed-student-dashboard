import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { studentService } from './studentService';

const EMPTY_RESUME_FORM = {
  name: '',
  title: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  summary: '',
  eduDegree: '',
  eduInst: '',
  eduYear: '',
  eduScore: '',
  intCompany: '',
  intRole: '',
  intDesc: '',
  projName: '',
  projStack: '',
  projDesc: ''
};

const EMPTY_RESUME_SKILLS = [];

/**
 * S-3 Resume Management Service
 * Provides real persistence for student resume data & skill tags across sessions.
 */
export const resumeService = {
  /**
   * Fetch current student resume content & skill tags from database.
   */
  async getResume() {
    const student = await studentService.getOrCreateStudent();

    const formData = await persistentStorage.get(
      'resume_form',
      async () => {
        if (!student?.id) return EMPTY_RESUME_FORM;

        const { data, error } = await supabase
          .from('student_resumes')
          .select('*')
          .eq('student_id', student.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) return EMPTY_RESUME_FORM;

        return {
          name: student.full_name || '',
          title: student.title || '',
          email: student.email || '',
          phone: student.phone || '',
          linkedin: student.linkedin || '',
          github: student.github || '',
          summary: data.summary || '',
          eduDegree: data.edu_degree || '',
          eduInst: data.edu_inst || '',
          eduYear: data.edu_year || '',
          eduScore: data.edu_score || '',
          intCompany: data.int_company || '',
          intRole: data.int_role || '',
          intDesc: data.int_desc || '',
          projName: data.proj_name || '',
          projStack: data.proj_stack || '',
          projDesc: data.proj_desc || ''
        };
      },
      EMPTY_RESUME_FORM
    );

    const skills = await persistentStorage.get(
      'resume_skills',
      async () => {
        if (!student?.id) return EMPTY_RESUME_SKILLS;

        const { data, error } = await supabase
          .from('student_resumes')
          .select('skills')
          .eq('student_id', student.id)
          .maybeSingle();

        if (error) throw error;
        return data?.skills || EMPTY_RESUME_SKILLS;
      },
      EMPTY_RESUME_SKILLS
    );

    return { formData, skills };
  },

  /**
   * Persist updated student resume form data directly to Supabase.
   * @param {Object} formData 
   */
  async updateResume(formData) {
    const student = await studentService.getOrCreateStudent();
    const { skills } = await this.getResume();
    const updatedForm = { ...formData };

    return persistentStorage.set(
      'resume_form',
      async () => {
        if (!student?.id) return;

        const payload = {
          student_id: student.id,
          summary: updatedForm.summary,
          edu_degree: updatedForm.eduDegree,
          edu_inst: updatedForm.eduInst,
          edu_year: updatedForm.eduYear,
          edu_score: updatedForm.eduScore,
          int_company: updatedForm.intCompany,
          int_role: updatedForm.intRole,
          int_desc: updatedForm.intDesc,
          proj_name: updatedForm.projName,
          proj_stack: updatedForm.projStack,
          proj_desc: updatedForm.projDesc,
          skills: skills,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('student_resumes')
          .upsert(payload, { onConflict: 'student_id' });

        if (error) throw error;
      },
      updatedForm
    );
  },

  /**
   * Persist updated skill tags list directly to Supabase.
   * @param {string[]} skills 
   */
  async updateSkills(skills) {
    const student = await studentService.getOrCreateStudent();
    const updatedSkills = [...skills];

    return persistentStorage.set(
      'resume_skills',
      async () => {
        if (!student?.id) return;

        const { error } = await supabase
          .from('student_resumes')
          .upsert({ 
            student_id: student.id,
            skills: updatedSkills, 
            updated_at: new Date().toISOString() 
          }, { onConflict: 'student_id' });

        if (error) throw error;
      },
      updatedSkills
    );
  }
};

