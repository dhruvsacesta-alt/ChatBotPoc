const { QdrantClient } = require('@qdrant/js-client-rest');
require('dotenv').config();

const client = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY
});
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'docs_collection';

/**
 * Initialize collection if it doesn't exist
 * text-embedding-3-large produces 3072 dimensions
 */
async function initCollection() {
    try {
        const collections = await client.getCollections();
        const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

        if (!exists) {
            console.log(`Creating collection: ${COLLECTION_NAME}`);
            await client.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 3072,
                    distance: 'Cosine',
                },
            });
            console.log('Collection created successfully.');
        } else {
            console.log(`Collection ${COLLECTION_NAME} already exists.`);
        }
    } catch (error) {
        console.error('Error initializing Qdrant collection:', error);
        throw error;
    }
}

/**
 * Upsert points to Qdrant
 */
async function upsertVectors(points) {
    try {
        await client.upsert(COLLECTION_NAME, {
            wait: true,
            points: points,
        });
    } catch (error) {
        console.error('Error upserting to Qdrant:', error);
        throw error;
    }
}

/**
 * Search similarity
 */
async function searchVectors(vector, limit = 5) {
    try {
        const results = await client.search(COLLECTION_NAME, {
            vector: vector,
            limit: limit,
            with_payload: true,
        });
        return results;
    } catch (error) {
        console.error('Error searching Qdrant:', error);
        throw error;
    }
}

module.exports = { initCollection, upsertVectors, searchVectors };
