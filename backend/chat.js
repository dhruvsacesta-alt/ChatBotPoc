const { getEmbedding, getChatCompletion } = require('./openai');
const { searchVectors } = require('./qdrant');

/**
 * Handle user question
 */
async function handleChat(question) {
    if (!question) {
        throw new Error('Question is required');
    }

    // 1. Convert question to embedding
    const queryEmbedding = await getEmbedding(question);

    // 2. Search Qdrant for top relative chunks
    const searchResults = await searchVectors(queryEmbedding, 5);

    if (!searchResults || searchResults.length === 0) {
        return "Not found in documents";
    }

    // 3. Combine chunks for context
    const context = searchResults
        .map((res) => `[Source: ${res.payload.source}]\n${res.payload.text}`)
        .join('\n\n---\n\n');

    // 4. Generate answer from LLM
    const answer = await getChatCompletion(context, question);

    return answer;
}

module.exports = { handleChat };
