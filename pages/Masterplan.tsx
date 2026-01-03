import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Masterplan: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [selectedZone, setSelectedZone] = useState('townhouse');

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors">
             <header className="flex items-center bg-white dark:bg-surface-dark p-4 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors justify-between">
                <button onClick={() => navigate(-1)} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">마스터플랜</h2>
                <button onClick={toggleTheme} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800">
                    <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col pb-24">
                <div className="px-4 pt-6 pb-2 bg-white dark:bg-surface-dark transition-colors">
                    <h1 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mb-2">자연 속 마을형 리조트/주거</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                        남한강변 5만 평 단지. 타운하우스, 캡슐존, 커뮤니티, 산책로, 뷰데크 등 다양한 시설을 만나보세요.
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar bg-white dark:bg-surface-dark transition-colors">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-5 shadow-sm shadow-primary/30 transition-all text-white text-sm font-semibold">전체</button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-surface-light/10 px-5 text-slate-700 dark:text-gray-300 text-sm font-medium">주거존</button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-surface-light/10 px-5 text-slate-700 dark:text-gray-300 text-sm font-medium">편의시설</button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-surface-light/10 px-5 text-slate-700 dark:text-gray-300 text-sm font-medium">자연</button>
                </div>

                {/* Map Container */}
                <div className="relative w-full h-[450px] bg-slate-200 dark:bg-gray-900 overflow-hidden group">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105" 
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV6V_-J3GXazE06psqdIi7KgwoXvYkeiZIFATdnrKNBJUHaxHGk0h_yrsVXId_DB2kpbd_Qr21Ue33a8qTiHittmz4aD3Iz7udJJiAtc_-AwdHs5_Uh9g_FgvK2R7swTDqStZgGTJ6S8PzLqbjhOoqwX9-L-wDJINR8vNB68cMPmuO_wi8gJ_pAdhng37tNvSdc4eh0R-5xe-QJrRx5PbNkaQoHR5MaDKS_oOa-JDkQz8FQxDE-VuYEXD-Q4TT-YC8HEa7MS3nsJXd")' }}
                    >
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Interactive Pins */}
                    <button onClick={() => setSelectedZone('townhouse')} className="absolute top-[30%] left-[25%] flex flex-col items-center group/marker z-10">
                        <div className="relative flex items-center justify-center size-12">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <div className="relative inline-flex rounded-full size-4 bg-primary border-2 border-white shadow-lg"></div>
                        </div>
                        <div className="mt-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-md">
                            <span className="text-xs font-bold text-slate-900">타운하우스존</span>
                        </div>
                    </button>

                    <button className="absolute bottom-[35%] left-[45%] flex flex-col items-center group/marker opacity-80 hover:opacity-100 transition-opacity">
                        <div className="relative flex items-center justify-center size-8">
                            <span className="material-symbols-outlined text-primary drop-shadow-md text-[28px]">location_on</span>
                        </div>
                        <span className="px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded text-[10px] font-medium text-slate-700 hidden group-hover/marker:block">커뮤니티</span>
                    </button>

                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                         <div className="flex flex-col rounded-lg bg-white dark:bg-surface-dark shadow-lg border border-slate-100 dark:border-gray-800 overflow-hidden">
                            <button className="flex size-10 items-center justify-center border-b border-slate-100 dark:border-gray-800 active:bg-slate-50 dark:active:bg-gray-800"><span className="material-symbols-outlined text-slate-700 dark:text-gray-200">add</span></button>
                            <button className="flex size-10 items-center justify-center active:bg-slate-50 dark:active:bg-gray-800"><span className="material-symbols-outlined text-slate-700 dark:text-gray-200">remove</span></button>
                         </div>
                         <button className="flex size-10 items-center justify-center rounded-lg bg-white dark:bg-surface-dark shadow-lg border border-slate-100 dark:border-gray-800 active:bg-slate-50 dark:active:bg-gray-800">
                            <span className="material-symbols-outlined text-primary">near_me</span>
                        </button>
                    </div>
                </div>

                {/* Details Card */}
                <div className="-mt-4 relative z-20 mx-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-xl border border-slate-100 dark:border-gray-800 transition-colors">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">주거시설</span>
                                    <span className="text-slate-400 text-xs font-medium">• A구역</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">타운하우스존</h3>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">info</span>
                            </button>
                        </div>
                        <div className="h-32 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFrE0F00x1o-GZkbv8XpfY-7eAzRxeoBxUJV_lMLpQE00JTLk-_NeTBLcYu3DDpUy_NPlCJ2qhnZZlBjKA7u0EnmqGiEWpqumR7PCeQGs6RC_7B4F0Yvit56IDQSK6wvRqUT2G-LieonS38V8--JMMIc8fGmkTh0_d33TK8xNAeW7l-DTogpzGHgbyMtPsFfrhIfsthOUj_69ulI3N4yqw4qm68KMaTnWIxo6shckM52WOnIAVrAwZEgaNg2CEtAYlZ1GleBv8_ocx")' }}></div>
                        <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                            개별 정원과 탁 트인 리버뷰를 자랑하는 프리미엄 단독주택. 자연 속에서 누리는 미니멀 라이프를 경험하세요.
                        </p>
                        <div className="flex gap-4 pt-2 border-t border-slate-100 dark:border-gray-700">
                             <Feature icon="square_foot" text="40-60평" />
                             <Feature icon="bedroom_parent" text="침실 3-4" />
                             <Feature icon="park" text="개별정원" />
                             <Feature icon="water_drop" text="리버뷰" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Feature = ({ icon, text }: { icon: string, text: string }) => (
    <div className="flex flex-col items-center gap-1">
        <span className="material-symbols-outlined text-slate-400 text-[20px]">{icon}</span>
        <span className="text-[10px] font-semibold text-slate-500">{text}</span>
    </div>
);

export default Masterplan;