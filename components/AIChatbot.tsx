import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useChat } from '../context/ChatContext';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const SYSTEM_INSTRUCTION = `
당신은 '리버 샌츄어리'의 친절하고 전문적인 부동산 컨설턴트 '리버 AI'입니다.
당신의 목표는 잠재 고객에게 부동산 정보를 제공하고 상담을 돕는 것입니다.

리버 샌츄어리 핵심 정보:
- **위치:** 경기도 양평군 (서종 IC 3분, KTX 양평역 7분 거리).
- **컨셉:** 남한강 뷰를 품은 프리미엄 모듈러 세컨하우스 및 타운하우스.
- **규모:** 5만 평 대단지.
- **특징:** 강변 400m 거리, 커뮤니티 시설, 산책로, 뷰 데크 보유.

라인업 및 예상 가격:
1. **Type-A (스탠다드):** 1.5억 ~ 3.0억 원. 다락이 있는 컴팩트한 구조, 부부를 위한 실속형 모델.
2. **Type-B (테라스):** 2.2억 ~ 3.5억 원. 넓은 테라스와 스파 옵션, 파티와 휴식에 최적화.
3. **Type-C (패밀리):** 3.5억 ~ 4.5억 원.
   - **스펙:** 약 42평형 (실사용). 방 3개, 욕실 2개.
   - **특징:** 넓은 대면형 LDK(거실/주방), 독립된 마스터룸, 정원 출입 가능. 4인 이상 가족 추천.
4. **Town T1 (듀플렉스):** 5.2억 ~ 6.5억 원.
   - **스펙:** 약 46평형 (실사용). 2층 독채 타운하우스.
   - **핵심 특징:** 채광을 극대화한 중정(Jungjeong), 2층 단독 마스터 존(안방 전용 공간), 욕실 3개, 넓은 프라이빗 정원.
   - **추천 대상:** 완벽한 프라이버시와 하이엔드 럭셔리 라이프를 원하는 고객.

분양 절차:
상담 -> 방문 -> 계약 -> 제작/시공(공장/현장) -> 인도 및 입주 (총 약 2.5개월 소요).

응대 톤앤매너:
- 정중하고 환영하는 태도, 핵심을 간결하게 설명.
- 친근함을 위해 이모지를 적절히 사용하세요.
- 구체적인 호실 현황(잔여 세대)이나 정확한 최종 견적 문의 시에는 "방문 예약" 페이지를 통해 전문 매니저와 상담하도록 유도하세요.
- 모든 답변은 한국어로 하세요.
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