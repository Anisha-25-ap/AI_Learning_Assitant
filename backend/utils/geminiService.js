import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// AI configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not set.');
  process.exit(1);
}

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate flashcards from text
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.
  Format each flashcard as:
  Q: [clear, specific question]
  A: [Concise, accurate answer]
  D: [Difficulty level: easy, medium, or hard]
  ---
  Text: ${text.substring(0, 15000)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    const flashcards = [];
    const blocks = generatedText.split('---').filter(c => c.trim());

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      let question = '', answer = '', difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) question = line.substring(2).trim();
        else if (line.startsWith('A:')) answer = line.substring(2).trim();
        else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) difficulty = diff;
        }
      }
      if (question && answer) flashcards.push({ question, answer, difficulty });
    }
    return flashcards.slice(0, count);
  } catch (error) {
    console.error('Gemini API error: ', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate quiz questions
 */
export const generateQuiz = async (text, numQuestion = 5) => {
  const prompt = `Generate exactly ${numQuestion} multiple choice questions from the following text.
  Format each question as:
  Q: [Question]
  01: [option 1]
  02: [option 2]
  03: [option 3]
  04: [option 4]
  C: [correct option - exactly as written above]
  E: [Brief explanation]
  D: [Difficulty: easy, medium, or hard]
  ---
  Text: ${text.substring(0, 15000)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    const questions = [];
    const blocks = generatedText.split('---').filter(q => q.trim());

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Q:')) question = trimmed.substring(2).trim();
        else if (trimmed.match(/^0[1-4]:/)) options.push(trimmed.substring(3).trim());
        else if (trimmed.startsWith('C:')) correctAnswer = trimmed.substring(2).trim();
        else if (trimmed.startsWith('E:')) explanation = trimmed.substring(2).trim();
        else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) difficulty = diff;
        }
      }
      if (question && options.length >= 2 && correctAnswer) {
        questions.push({ question, options, correctAnswer, explanation, difficulty });
      }
    }
    return questions.slice(0, numQuestion);
  } catch (error) {
    console.error('Gemini API error: ', error);
    throw new Error('Failed to generate quiz');
  }
};

/**
 * Generate document summary
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text: ${text.substring(0, 20000)}`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error: ", error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * Chat with context
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content || c.context}`).join('\n\n');
  const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error: ", error);
    throw new Error("Failed to process chat request");
  }
};

/**
 * Explain concept
 */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain "${concept}" based on this context: ${context.substring(0, 10000)}`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error: ", error);
    throw new Error("Failed to explain concept");
  }
};