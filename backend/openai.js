const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for a given text using text-embedding-3-large
 */
async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate chat completion using context and question
 */
async function getChatCompletion(context, question) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using gpt-4o as default for better performance
      messages: [
        {
          role: 'system',
          content: `You are a professional assistant for document-based retrieval. 
          Respond to the user's question ONLY using the provided context chunks.
          Strict Rules:
          1. Answer ONLY from the context provided.
          2. If the answer is not present in the context, respond with: "Not found in documents".
          3. Do not use any outside knowledge.
          4. Do not hallucinate.
          5. Keep the tone professional and helpful.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
}

module.exports = { getEmbedding, getChatCompletion };
