import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="relative flex min-h-screen w-full flex-col pb-24 bg-[#f6f7f8] dark:bg-[#111c21] transition-colors duration-300">
            {/* Header Overlay */}
            <header className="absolute top-0 left-0 w-full z-50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1c2730]/90 backdrop-blur-md py-2 px-3 rounded-full shadow-sm transition-colors">
                        <span className="material-symbols-filled text-primary text-2xl">water_lux</span>
                        <span className="text-sm font-bold tracking-tight text-black dark:text-white">River Sanctuary</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="flex items-center justify-center size-10 bg-white/90 dark:bg-[#1c2730]/90 backdrop-blur-md rounded-full shadow-sm text-black dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all active:scale-95"
                            aria-label="Toggle Dark Mode"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button className="flex items-center justify-center size-10 bg-white/90 dark:bg-[#1c2730]/90 backdrop-blur-md rounded-full shadow-sm text-black dark:text-white transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative w-full h-[65vh] overflow-hidden rounded-b-3xl shadow-xl">
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2iPDgwlS5mGElh_6D4Scwk0yLZHuTZRCMLD5fymGOc86MYe1SNv-LMs50u0GHZz0jB64stzh3a6d7JJ-xlFz-H5-9bPCNH8SOG8wXSuz2hDyW_wTNhQI7AWnywSgRyw3QmtKG7UPHGDwuNhZqIrTdqteS7fUaEsQEaPKUTfpahqOTitJ0K_KoI1TO2S4pETyg1mae4L_JE-mnY-14MhF1XzFk11zLP3Q7Z1UR-BecqX1D2cJgUpZPN1s3nAALBXs5ypBrKLspaT6h')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 w-full p-6 pb-12 flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/90 w-fit mb-2 backdrop-blur-sm">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">분양 중</span>
                    </div>
                    <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight break-keep">
                        강변의 고요한 안식처,<br />리버 샌츄어리
                    </h1>
                    <p className="text-gray-200 text-lg font-medium leading-snug max-w-[90%] break-keep">
                        도심 접근 3분, 자연과 럭셔리가 만나는 프리미엄 세컨하우스
                    </p>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="px-4 -mt-8 relative z-10">
                <div className="bg-white dark:bg-[#1c2730] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-3 transition-colors">
                    <button 
                        onClick={() => navigate('/booking')}
                        className="flex w-full items-center justify-between rounded-xl h-14 px-5 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-white shadow-md shadow-primary/20 group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-filled text-xl">calendar_month</span>
                            <span className="text-base font-bold">방문 예약하기</span>
                        </div>
                        <span className="material-symbols-outlined text-white/80 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/lineup')}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl h-12 bg-gray-100 dark:bg-gray-700/50 text-[#111518] dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary">apartment</span>
                            라인업 보기
                        </button>
                        <button 
                            onClick={() => navigate('/process')}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl h-12 bg-gray-100 dark:bg-gray-700/50 text-[#111518] dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary">pending_actions</span>
                            분양 절차
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-5 pt-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#111518] dark:text-white transition-colors">리버 샌츄어리의 특별함</h2>
                    <span onClick={() => navigate('/masterplan')} className="text-xs font-semibold text-primary cursor-pointer">마스터플랜 보기</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: 'directions_car', title: 'IC 3분 진입', desc: '편리한 쾌속 교통망' },
                        { icon: 'water_drop', title: '남한강 조망', desc: '파노라마 자연 경관' },
                        { icon: 'map', title: '5만평 규모', desc: '압도적 대단지 계획' },
                        { icon: 'timelapse', title: '합리적 가격', desc: '빠른 시공과 입주' },
                    ].map((item, idx) => (
                        <div key={idx} onClick={() => navigate('/location')} className="bg-white dark:bg-[#1c2730] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-start gap-3 cursor-pointer hover:shadow-md transition-all">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-filled">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-tight dark:text-gray-100 transition-colors">{item.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-keep transition-colors">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="px-5 py-4">
                <div 
                    onClick={() => navigate('/detail')}
                    className="relative w-full h-40 rounded-2xl overflow-hidden group cursor-pointer"
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJHet4TG_z5KszfUjgwQ7qFiMLHJtalEbb3Jpv51vOT3cKD4gI7M1qy_tnGb5gzJTjKEuQ_N_DNu5PZOV4lsh9Irq9Iz2X1KalcUopeOXlY_0DTHyB387dktz3M9CY2cF9PcK0ACRoj6xQ20AQgmiSPXKG1LXADZAfbB_VAg8j_aizcuswaIxmHMjd3KQH6ffuf6N-1Zb6IkY9XFaYST6dQR65BJdVw7mm9J0bPk3HpqoJl5Y_X16Kc2sEjSxYvDm7t8a_v9VOizHr')" }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-white/80 text-sm font-medium mb-1">잔여 세대 특별 혜택</p>
                            <h3 className="text-white text-xl font-bold">1차 분양 마감 임박</h3>
                            <button className="mt-3 px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full">가능 호실 확인</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;