// netlify/functions/spam-prevention.js
import SPAM_KEYWORDS from "./spam-keywords.json";

/**
 * Checks if the submission contains any spam keywords
 * @param {Object} data - The form submission data
 * @returns {Object} { isSpam: boolean, matchedKeywords: string[] }
 */
export function checkForSpamKeywords(data) {
  const matchedKeywords = [];

  // Convert all text values to a single lowercase string for checking
  const textContent = Object.entries(data)
    .filter(([key, value]) => typeof value === "string")
    .map(([key, value]) => value.toLowerCase())
    .join(" ");

  // Check each keyword
  for (const keyword of SPAM_KEYWORDS) {
    if (textContent.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  }

  return {
    isSpam: matchedKeywords.length > 0,
    matchedKeywords,
  };
}

/**
 * Detects random/gibberish text that's likely from spam bots
 * @param {string} text - The text to analyze
 * @returns {boolean} - True if text appears to be random gibberish
 */
function isRandomGibberish(text) {
  if (!text || text.length < 5) return false;

  const cleanText = text.toLowerCase().replace(/[^a-z]/g, "");
  if (cleanText.length < 5) return false;

  // Count vowels for ratio analysis
  const vowels = cleanText.match(/[aeiou]/g) || [];
  const vowelRatio = vowels.length / cleanText.length;

  // Check for excessive consonant clusters (4+ consonants in a row)
  const hasExcessiveClusters = /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(text);

  // Check for alternating case patterns (common in random generation)
  const hasRandomCase = /[a-z][A-Z][a-z][A-Z]/.test(text) || /[A-Z][a-z][A-Z][a-z][A-Z]/.test(text);

  // Check vowel ratio - legitimate text usually has 30-45% vowels
  const hasAbnormalVowelRatio = vowelRatio < 0.15 || vowelRatio > 0.7;

  // Check for lack of common short words
  const hasNoCommonWords = !/\b(the|and|for|is|in|to|of|a|an|it|at|on|be|as)\b/i.test(text);

  // Consider it gibberish if it meets multiple criteria
  let gibberishScore = 0;
  if (hasExcessiveClusters) gibberishScore++;
  if (hasRandomCase) gibberishScore++;
  if (hasAbnormalVowelRatio) gibberishScore++;
  if (hasNoCommonWords && text.length > 10) gibberishScore++;

  return gibberishScore >= 2;
}

/**
 * Checks if the submission contains random gibberish text
 * @param {Object} data - The form submission data
 * @returns {Object} { isGibberish: boolean, suspiciousFields: string[] }
 */
export function checkForGibberish(data) {
  const suspiciousFields = [];

  // Check name - be more lenient (require score of 3+ for names due to diverse naming)
  if (data.name) {
    const cleanName = data.name.toLowerCase().replace(/[^a-z]/g, "");
    if (cleanName.length >= 5) {
      const vowels = cleanName.match(/[aeiou]/g) || [];
      const vowelRatio = vowels.length / cleanName.length;
      const hasExcessiveClusters = /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(data.name);
      const hasRandomCase = /[a-z][A-Z][a-z][A-Z]/.test(data.name) || /[A-Z][a-z][A-Z][a-z][A-Z]/.test(data.name);
      const hasAbnormalVowelRatio = vowelRatio < 0.1 || vowelRatio > 0.75;

      let nameScore = 0;
      if (hasExcessiveClusters) nameScore += 2; // Weight this heavily
      if (hasRandomCase) nameScore++;
      if (hasAbnormalVowelRatio) nameScore++;

      if (nameScore >= 3) {
        suspiciousFields.push("name");
      }
    }
  }

  // Check message - use standard detection
  if (data.message && isRandomGibberish(data.message)) {
    suspiciousFields.push("message");
  }

  return {
    isGibberish: suspiciousFields.length > 0,
    suspiciousFields,
  };
}

/**
 * Checks if honeypot field is filled (indicating spam bot)
 * @param {Object} data - The form submission data
 * @returns {boolean} - True if honeypot detected spam
 */
export function checkHoneypot(data) {
  return data["website"] && data["website"].trim() !== "";
}

/**
 * Checks if form was submitted too quickly (indicating spam bot)
 * @param {Object} data - The form submission data
 * @param {number} minSeconds - Minimum seconds required (default: 6)
 * @returns {Object} { isTooFast: boolean, timeTaken: number }
 */
export function checkSubmissionSpeed(data, minSeconds = 6) {
  const timeTaken = parseInt(data["time-taken"]);
  return {
    isTooFast: timeTaken < minSeconds,
    timeTaken,
  };
}
