import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useChat } from '../context/ChatContext';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const SYSTEM_INSTRUCTION = `
You are "River AI", a friendly and professional real estate consultant for "River Sanctuary".
Your goal is to help potential buyers with information about the property.

Key Information about River Sanctuary:
- **Location:** Yangpyeong-gun, Gyeonggi-do (3 mins from Seojong IC, 7 mins from KTX Yangpyeong Station).
- **Concept:** Premium modular second houses and townhouses with Namhan River views.
- **Scale:** 50,000 pyeong large-scale complex.
- **Features:** 400m from the river, community facilities, walking trails, view decks.

Lineup & Pricing (Estimates):
1. **Type-A (Standard):** 10 pyeong (approx 33 sqm). 1.5 - 3.0 억 KRW (150-300 Million KRW). Compact, attic structure, cost-effective.
2. **Type-B (Terrace):** 12 pyeong (approx 40 sqm). 2.2 - 3.5 억 KRW (220-350 Million KRW). Large terrace, spa option.
3. **Type-C (Family):** 15 pyeong (approx 50 sqm). 3.5 - 4.5 억 KRW (350-450 Million KRW). 2 rooms + living room + garden.
4. **Town T1 (Duplex):** 28 pyeong (approx 92 sqm). 5.2 - 6.5 억 KRW (520-650 Million KRW). 2-story private house, private garden.

Process:
Consultation -> Visit -> Contract -> Production/Construction (Factory) -> Delivery & Move-in (approx 2.5 months total).

Tone:
- Polite, welcoming, and concise.
- Use emojis occasionally to be friendly.
- If asked about specific availability or exact quotes, encourage them to use the "Booking" page for a consultation.
- Answer in Korean language.
`;

const AIChatbot: React.FC = () => {
    const { isOpen, openChat, closeChat } = useChat();
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'model', text: '안녕하세요! 리버 샌츄어리 AI 매니저입니다. 👋\n분양가, 위치, 모델 차이점 등 무엇이든 물어보세요!' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Initialize AI Client
    const aiRef = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !aiRef.current) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsThinking(true);

        try {
            // Filter out the initial greeting from history to prevent role confusion if API is strict
            // although Gemini typically handles it fine, it's cleaner to send user/model pairs from actual history.
            const history = messages.slice(1).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const chat = aiRef.current.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.7,
                },
                history: history
            });

            const result = await chat.sendMessageStream({ message: userMsg.text });
            
            let fullText = '';
            const aiMsgId = (Date.now() + 1).toString();
            
            // Add placeholder for AI response
            setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '' }]);

            for await (const chunk of result) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setMessages(prev => prev.map(msg => 
                        msg.id === aiMsgId ? { ...msg, text: fullText } : msg
                    ));
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '죄송합니다. 잠시 연결이 원활하지 않습니다. 다시 시도해 주세요.' }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    if (!isOpen) {
        return (
            <button 
                onClick={openChat}
                className="fixed bottom-20 right-4 z-50 flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-110 transition-transform active:scale-95 animate-bounce-subtle"
                aria-label="Open AI Chatbot"
            >
                <span className="material-symbols-outlined text-3xl">smart_toy</span>
                <span className="absolute -top-1 -right-1 flex size-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-4 bg-red-500"></span>
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-w-[calc(100vw-32px)] h-[500px] max-h-[60vh] bg-white dark:bg-[#1c2730] rounded-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">River AI</h3>
                        <p className="text-[10px] opacity-90 text-white/80">실시간 상담 중</p>
                    </div>
                </div>
                <button onClick={closeChat} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#111c21]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex gap-1">
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-[#1c2730] border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="궁금한 점을 입력하세요..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isThinking}
                        className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
                            inputText.trim() ? 'text-primary hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;