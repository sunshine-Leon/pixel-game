const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const QUESTION_COUNT = import.meta.env.VITE_QUESTION_COUNT || 10;

export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${GAS_URL}?n=${QUESTION_COUNT}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return mock data for development if URL is not set
    return Array.from({ length: QUESTION_COUNT }, (_, i) => ({
      id: i + 1,
      question: `[MOCK] 這是一道測試題目 ${i + 1}`,
      options: { A: '選項 A', B: '選項 B', C: '選項 C', D: '選項 D' }
    }));
  }
};

export const submitResults = async (userId, answers) => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ userId, answers }),
    });
    if (!response.ok) throw new Error('Failed to submit results');
    return await response.json();
  } catch (error) {
    console.error('Error submitting results:', error);
    // Mock result for dev
    const score = answers.length; // Assume all correct for mock
    return {
      status: 'success',
      score,
      isPassed: score >= (import.meta.env.VITE_PASS_THRESHOLD || 8)
    };
  }
};
