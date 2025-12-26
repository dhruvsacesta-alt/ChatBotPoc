const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { getEmbedding } = require('./openai');
const { initCollection, upsertVectors } = require('./qdrant');
const { v4: uuidv4 } = require('uuid');

/**
 * Split text into chunks
 */
function chunkText(text, size = 1000, overlap = 200) {
    const chunks = [];
    // Basic cleaning
    const cleanText = text.replace(/\s+/g, ' ').trim();

    let i = 0;
    while (i < cleanText.length) {
        chunks.push(cleanText.slice(i, i + size));
        i += size - overlap;
    }
    return chunks;
}

/**
 * Process all PDFs in the /docs folder
 */
async function ingestDocs() {
    await initCollection();

    const docsDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
        return { message: 'Docs folder created. Please add PDFs and try again.' };
    }

    const files = fs.readdirSync(docsDir).filter((file) => file.endsWith('.pdf'));

    if (files.length === 0) {
        return { message: 'No PDF files found in /docs folder.' };
    }

    let totalChunks = 0;

    for (const file of files) {
        console.log(`Ingesting: ${file}`);
        const filePath = path.join(docsDir, file);
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        const text = data.text;
        const chunks = chunkText(text);
        console.log(`${file}: Split into ${chunks.length} chunks.`);

        const points = [];
        for (const chunk of chunks) {
            if (!chunk.trim() || chunk.length < 10) continue;

            const embedding = await getEmbedding(chunk);
            points.push({
                id: uuidv4(),
                vector: embedding,
                payload: {
                    text: chunk,
                    source: file,
                },
            });

            // Batching for performance
            if (points.length >= 20) {
                await upsertVectors([...points]);
                totalChunks += points.length;
                points.length = 0;
            }
        }

        if (points.length > 0) {
            await upsertVectors(points);
            totalChunks += points.length;
        }
    }

    return { message: `Successfully ingested ${files.length} documents (${totalChunks} chunks).` };
}

module.exports = { ingestDocs };
