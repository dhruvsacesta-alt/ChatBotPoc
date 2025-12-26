import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Database, Loader2 } from 'lucide-react';
import { sendChatRequest, triggerIngestion } from './api';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your document-based assistant. How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [ingesting, setIngesting] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const response = await sendChatRequest(userMsg);
            setMessages((prev) => [...prev, { role: 'bot', text: response.answer }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: 'Sorry, I encountered an error processing your request.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleIngest = async () => {
        setIngesting(true);
        try {
            const result = await triggerIngestion();
            alert(result.message);
        } catch (error) {
            alert('Error during ingestion: ' + error.message);
        } finally {
            setIngesting(false);
        }
    };

    return (
        <div className="app-container">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bot size={28} color="#818cf8" />
                    <h1>DocChat AI</h1>
                </div>
                <button
                    className="ingest-btn"
                    onClick={handleIngest}
                    disabled={ingesting}
                >
                    {ingesting ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Loader2 className="animate-spin" size={16} /> Ingesting...
                        </span>
                    ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Database size={16} /> Sync Documents
                        </span>
                    )}
                </button>
            </header>

            <main className="chat-window">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                            <div className="text-content">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="loader">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>

            <form className="input-area" onSubmit={handleSend}>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Ask a question about your documents..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
