import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Process: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark transition-colors">
            <header className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 transition-colors">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 text-[#111518] dark:text-white">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold leading-tight flex-1 text-center dark:text-white">분양 절차</h2>
                <button onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 text-[#111518] dark:text-white">
                    <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                <div className="px-4 py-4">
                    <div className="relative flex flex-col justify-end overflow-hidden rounded-xl min-h-[220px] bg-gray-200 shadow-md" 
                        style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAUBkhijPbZkHOOvNZeV-P39p7Oi12T7mDXraj-kpKTgA351Q5R8n30bkejfj-5R1OwzSVJa5gcRAQGFZmQwTvv16XQB72eSvJF0h9LtCCj_ILU_yCkeeiVr43XINgn_9aAX2qcR7B3Kfs5cVzaUgbVQdIGIyitL6M9MbmPMLdFwOKSWmPwjAwkyudyA2nSMl4UwHKwYSMQla936jH8Rn3o3apuwV-aYFzsDCuKLmMy-tFyjmIYBNGFDU5yNDeVjK5v3tzt6Cy4SjV")' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="relative z-10 p-5">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-0.5 mb-3 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white text-[14px]">verified</span>
                                <span className="text-white text-xs font-bold tracking-wide">투명한 분양 프로세스</span>
                            </div>
                            <h1 className="text-white text-2xl font-extrabold leading-tight mb-1">남한강변 세컨하우스,<br/>내 집 마련 5단계</h1>
                            <p className="text-gray-200 text-sm font-medium mt-1 opacity-90">상담부터 입주까지 꼼꼼하게 챙겨드립니다.</p>
                        </div>
                    </div>
                </div>

                <div className="px-5 mt-2">
                    {[
                        { step: '01', title: '상담', desc: '전문 상담원과 전화 및 온라인 상담을 통해 고객님의 니즈를 파악하고 기본 분양 정보를 안내해 드립니다.', icon: 'headset_mic' },
                        { step: '02', title: '방문', desc: '남한강변 현장 및 모델하우스를 직접 방문하여 입지와 구조를 꼼꼼하게 확인하실 수 있습니다.', icon: 'location_on' },
                        { step: '03', title: '계약', desc: '원하시는 호실을 선정하고 청약 및 정식 분양 계약을 체결하여 내 집 마련을 확정합니다.', icon: 'edit_document' },
                        { step: '04', title: '제작/시공', desc: '엄격한 품질 관리 하에 주택 제작 및 현장 시공이 진행되며 진행 상황을 공유해 드립니다.', icon: 'construction' },
                        { step: '05', title: '인도 및 A/S', desc: '완공된 주택을 인도받으시고 입주를 시작하며, 이후 철저한 사후 관리 서비스를 제공합니다.', icon: 'vpn_key' }
                    ].map((item, idx, arr) => (
                        <div key={item.step} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className="size-12 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center shrink-0 z-10 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                                    <span className={`material-symbols-outlined text-[24px] ${idx === 0 ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>{item.icon}</span>
                                </div>
                                <div className={`w-[2px] bg-gray-200 dark:bg-gray-800 h-full min-h-[60px] ${idx === arr.length - 1 ? 'hidden' : ''}`}></div>
                            </div>
                            <div className="flex-1 pb-8 pt-2">
                                <span className={`font-bold text-xs tracking-wider uppercase mb-1 block ${idx === 0 ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>STEP {item.step}</span>
                                <h3 className="text-[#111518] dark:text-white text-lg font-bold">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 px-6 py-6 bg-gray-50 dark:bg-surface-light/5 border-t border-gray-100 dark:border-gray-800 text-center transition-colors">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        모든 과정은 주택법 및 관련 법규를 준수하여 투명하게 진행됩니다.<br/>
                        문의사항은 언제든 고객센터로 연락주세요.
                    </p>
                </div>
            </main>
             <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto p-4 pb-8 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 transition-colors">
                <button onClick={() => navigate('/booking')} className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>방문 예약 / 무료 상담</span>
                </button>
            </div>
        </div>
    );
};

export default Process;