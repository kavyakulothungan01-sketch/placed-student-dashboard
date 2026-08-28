/**
 * @typedef {Object} ResumeData
 * @property {string} name - Student full name
 * @property {string} title - Target professional role
 * @property {string} email - Email contact
 * @property {string} phone - Phone contact
 * @property {string} linkedin - LinkedIn URL
 * @property {string} github - GitHub URL
 * @property {string} summary - Professional bio summary
 * @property {string} eduDegree - Degree & major
 * @property {string} eduInst - College / Institution
 * @property {string} eduYear - Education year range
 * @property {string} eduScore - CGPA / Score
 * @property {string} intCompany - Internship company name
 * @property {string} intRole - Internship role & duration
 * @property {string} intDesc - Internship bullet points
 * @property {string} projName - Project name
 * @property {string} projStack - Project tech stack & year
 * @property {string} projDesc - Project bullet points
 * @property {string[]} skills - Technical skills tag array
 */

/**
 * @typedef {Object} ATSAnalysisResult
 * @property {number} score - Overall ATS compatibility match score (0-100)
 * @property {number} density - Keyword density percentage
 * @property {string[]} matched - List of matched keywords found in resume
 * @property {string[]} missing - List of missing keywords required by JD
 */
