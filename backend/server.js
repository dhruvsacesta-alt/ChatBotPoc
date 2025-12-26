const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { ingestDocs } = require('./ingest');
const { handleChat } = require('./chat');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

/**
 * Endpoint to trigger document ingestion
 */
app.post('/ingest', async (req, res) => {
    try {
        const result = await ingestDocs();
        res.json(result);
    } catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint for chat interaction
 */
app.post('/chat', async (req, res) => {
    const { question } = req.body;
    try {
        const answer = await handleChat(question);
        res.json({ answer });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
