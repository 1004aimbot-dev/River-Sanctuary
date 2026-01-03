import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide nav on specific pages if needed, usually details or booking
    // For this app, we'll keep it visible mostly, or hide on booking form
    if (location.pathname === '/booking') return null;

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#111c21]/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe z-50 max-w-[480px] mx-auto left-0 right-0">
            <div className="flex justify-around items-center h-16 px-2">
                <button 
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <span className={isActive('/') ? "material-symbols-filled text-2xl" : "material-symbols-outlined text-2xl"}>home</span>
                    <span className="text-[10px] font-medium">홈</span>
                </button>
                <button 
                    onClick={() => navigate('/lineup')}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/lineup') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <span className={isActive('/lineup') ? "material-symbols-filled text-2xl" : "material-symbols-outlined text-2xl"}>view_column</span>
                    <span className="text-[10px] font-medium">라인업</span>
                </button>
                <button 
                    onClick={() => navigate('/masterplan')}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/masterplan') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <span className={isActive('/masterplan') ? "material-symbols-filled text-2xl" : "material-symbols-outlined text-2xl"}>map</span>
                    <span className="text-[10px] font-medium">마스터플랜</span>
                </button>
                <button 
                    onClick={() => navigate('/faq')}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/faq') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <span className={isActive('/faq') ? "material-symbols-filled text-2xl" : "material-symbols-outlined text-2xl"}>support_agent</span>
                    <span className="text-[10px] font-medium">고객센터</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;