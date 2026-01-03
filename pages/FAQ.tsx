import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';

const FAQ: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { openChat } = useChat();

    return (
        <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark transition-colors">
             <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold leading-tight flex-1 text-center dark:text-white">고객센터</h1>
                    <button onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-4 pb-24 pt-4 gap-6">
                <div className="px-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">무엇을 도와드릴까요?</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">남한강 인근 전원주택에 대한 궁금증을 해결해 드립니다.</p>
                </div>

                <div className="w-full">
                    <label className="flex w-full items-center gap-3 rounded-2xl bg-white dark:bg-surface-dark px-4 py-3 shadow-sm border border-slate-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                        <input className="w-full bg-transparent text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none border-none p-0 focus:ring-0" placeholder="검색 (예: 비용, 인허가)" type="text" />
                    </label>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20">전체</button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 px-5 text-sm font-medium text-slate-600 dark:text-gray-300">건축/시공</button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 px-5 text-sm font-medium text-slate-600 dark:text-gray-300">법률/인허가</button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 px-5 text-sm font-medium text-slate-600 dark:text-gray-300">비용/금융</button>
                </div>

                <div className="flex flex-col gap-3">
                    <FAQItem icon="home" title="실거주 가능한가요?">
                        <p>네, 가능합니다. 해당 부지는 주거 용도로 정식 허가된 지역입니다. 매입 후 즉시 전입신고가 가능하며, 도심 접근성이 좋아 많은 분들이 실거주 목적으로 이용하고 계십니다.</p>
                        <div className="mt-3 flex gap-2">
                            <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20 dark:ring-green-400/20">주거 전용 지역</span>
                            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">즉시 입주 가능</span>
                        </div>
                    </FAQItem>

                    <FAQItem icon="engineering" title="인허가/설치 방식?">
                         <p>복잡한 인허가 절차는 저희가 전적으로 대행해 드립니다. 토목 인허가부터 건축 신고까지 모두 포함되어 있으며, 설치는 인허가 완료 후 약 2~3주 소요됩니다.</p>
                    </FAQItem>

                    <FAQItem icon="payments" title="유지관리비?">
                         <p className="mb-2">관리비는 평형에 따라 산정됩니다. 2룸 타운하우스 기준:</p>
                        <ul className="list-disc pl-4 space-y-1 marker:text-primary text-slate-600 dark:text-gray-400 text-sm">
                            <li>일반 관리비: 월 약 10만원</li>
                            <li>경비/보안: 월 약 5만원</li>
                            <li>조경 관리: 월 약 4만원</li>
                        </ul>
                        <p className="mt-2 text-xs font-semibold text-slate-400">예상 합계: 월 약 19만원</p>
                    </FAQItem>

                    <FAQItem icon="water_drop" title="남한강과의 거리는?">
                        <p>단지는 남한강변에서 불과 400m 거리에 위치하여 도보로 약 5분 정도 소요됩니다. 2층 이상 세대에서는 남한강 조망이 가능합니다.</p>
                    </FAQItem>
                </div>

                <div className="rounded-xl bg-slate-100 dark:bg-surface-dark p-5 flex flex-col items-center justify-center text-center gap-2 mt-4 transition-colors">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm mb-1">
                        <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">더 궁금한 점이 있으신가요?</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 max-w-[200px]">전문 상담사가 매일 오전 9시부터 오후 6시까지 대기 중입니다.</p>
                    <button onClick={openChat} className="mt-2 text-primary font-semibold text-sm hover:underline">채팅 상담하기</button>
                </div>
            </main>
        </div>
    );
};

const FAQItem = ({ icon, title, children }: { icon: string, title: string, children?: React.ReactNode }) => (
    <details className="group bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden open:ring-1 open:ring-primary/20 transition-all duration-300">
        <summary className="flex cursor-pointer items-center justify-between p-4 bg-transparent select-none list-none">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[20px]">{icon}</span>
                <h3 className="font-semibold text-slate-900 dark:text-white text-[15px] leading-snug">{title}</h3>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-open:text-primary group-open:-rotate-180 transition-transform duration-300">expand_more</span>
        </summary>
        <div className="px-4 pb-5 pl-[3.25rem] text-slate-500 dark:text-gray-400 text-sm leading-relaxed border-t border-slate-50 dark:border-gray-800 pt-3">
            {children}
        </div>
    </details>
);

export default FAQ;