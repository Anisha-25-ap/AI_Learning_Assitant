/**
 * split text into chunks for beter Ai processing 
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in word)
 * @param { number} overlap - number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean text while preserving paragraph structure 
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\n /g, '\n')
    .replace(/\n/g, '\n')
    .trim();

  // try to split by paragraphs (single or double newlines)
  const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordChunk = 0;
  let chunkIndex = 0;


  for (const paragraph of paragraphs) {
    const paragraphwords = paragraph.trim().split(/\s+/);
    const paragraphwordCount = paragraphwords.length;

    // If single paragraph exceeds chunk size, split it by words 
    if (paragraphwordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });
        currentChunk = [];
        currentWordChunk = 0;
      }

      // split large paragraph into word-baes chunks
      // FIXED: Added loop increment 'i += (chunkSize - overlap)' to prevent infinite loop
      for (let i = 0; i < paragraphwords.length; i += (chunkSize - overlap)) {
        const chunkWords = paragraphwords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });

        if (i + chunkSize >= paragraphwords.length) break;
      }
      continue;
    }

    // if adding this paragraph exceeds chunk size, save current chunk 
    if (currentWordChunk + paragraphwordCount > chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0
      });

      // create overlap from previous chunk 
      const preChunkText = currentChunk.join(' ');
      const preWords = preChunkText.split(/\s+/);
      const overlapText = preWords.slice(-Math.min(overlap, preWords.length)).join(' ');

      currentChunk = [overlapText, paragraph.trim()];
      currentWordChunk = overlapText.split(/\s+/).length + paragraphwordCount;
    } else {
      // Add paragraph to current chunk 
      currentChunk.push(paragraph.trim());
      currentWordChunk += paragraphwordCount;
    }
  }

  // Add the last chunk 
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex++, // FIXED: Added ++ for consistency
      pageNumber: 0
    });
  }

  // Fallback: if no chunks created, split by words
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(' '),
        chunkIndex: chunkIndex++,
        pageNumber: 0
      });
      if (i + chunkSize >= allWords.length) break;
    }
  }
  return chunks;
};

/**
 * find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxchunks - maxmium chunks to return
 * @returns {Array<Object>}
 */

export const findRelevantChunks = (chunks, query, maxchunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  // common stop words to exclude
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
  ]);

  // Extract and clean query words 
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    // Return clean chunk objects without Mongoose metadata
    return chunks.slice(0, maxchunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    // Score each query word
    for (const word of queryWords) {
      // Exact word match (higher score)
      // FIXED: RegRxp to RegExp
      const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      score += exactMatches * 3;

      // partial match (lower score)
      const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    // Bonus: Multiple query words found
    const uniqueWordsFound = queryWords.filter(word =>
      content.includes(word)
    ).length;
    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    // normalize by content length
    const normalizedScore = score / Math.sqrt(contentWords);


    // Small bouns for earlier chunks
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    // Return clean object without Mongoose metadata 

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchWords: uniqueWordsFound
    };
  });

  return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // FIXED: matchedWords to matchWords (taaki key match kare)
      if (b.matchWords !== a.matchWords) {
        return b.matchWords - a.matchWords;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxchunks);
};