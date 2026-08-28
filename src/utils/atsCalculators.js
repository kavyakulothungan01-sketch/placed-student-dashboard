export const ATS_KEYWORD_DICTIONARY = [
  'react', 'node.js', 'javascript', 'python', 'c++', 'java', 'sql', 'postgresql',
  'mongodb', 'git', 'github', 'agile', 'aws', 'docker', 'kubernetes', 'typescript',
  'html', 'css', 'data structures', 'algorithms', 'system design', 'rest api', 'microservices'
];

/**
 * Parses job description text against dictionary to find target keywords.
 * @param {string} jdText 
 * @returns {string[]} Matching keywords requested by JD
 */
export const extractRequiredKeywords = (jdText) => {
  if (!jdText) return [];
  const normalizedJD = jdText.trim().toLowerCase();
  return ATS_KEYWORD_DICTIONARY.filter(kw => normalizedJD.includes(kw));
};

/**
 * Calculates ATS compatibility score, density percentage, matched, and missing keywords.
 * @param {Object} formData - Resume text fields
 * @param {string[]} skills - Active skills tags array
 * @param {string} jdText - Job description text
 * @returns {Object|null} Result object containing score, density, matched, missing arrays
 */
export const analyzeATSCompatibility = (formData, skills, jdText) => {
  const requiredKeywords = extractRequiredKeywords(jdText);

  if (requiredKeywords.length === 0) {
    return { score: 0, density: 0, matched: [], missing: [] };
  }

  let resumeText = '';
  const fields = ['summary', 'eduDegree', 'intDesc', 'projStack', 'projDesc'];
  fields.forEach(field => {
    if (formData[field]) {
      resumeText += formData[field].toLowerCase() + ' ';
    }
  });

  if (skills && Array.isArray(skills)) {
    skills.forEach(skill => {
      resumeText += skill.toLowerCase() + ' ';
    });
  }

  const matched = [];
  const missing = [];
  let matchCount = 0;

  requiredKeywords.forEach(kw => {
    if (resumeText.includes(kw)) {
      matched.push(kw);
      matchCount++;
    } else {
      missing.push(kw);
    }
  });

  const atsScore = Math.round((matchCount / requiredKeywords.length) * 100);
  const totalWords = resumeText.split(/\s+/).filter(w => w.length > 2).length;
  const density = totalWords > 0 ? parseFloat(((matchCount / totalWords) * 100).toFixed(1)) : 0;

  return {
    score: atsScore,
    density,
    matched,
    missing
  };
};
