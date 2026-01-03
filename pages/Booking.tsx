import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Booking: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [interestType, setInterestType] = useState('second-house'); // 'second-house' or 'townhouse'

    useEffect(() => {
        const model = location.state?.model;
        if (model) {
            if (model.includes('type-t')) {
                setInterestType('townhouse');
            } else {
                setInterestType('second-house');
            }
        }
    }, [location.state]);

    const handleSubmit = () => {
        if (!name || !phone || !date) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        alert('예약이 접수되었습니다! 담당자가 곧 연락드립니다.');
        navigate('/');
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors">
             <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div onClick={() => navigate(-1)} className="text-[#111518] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </div>
                <h2 className="text-[#111518] dark:text-white text-lg font-bold leading-tight flex-1 text-center">
                    방문예약
                </h2>
                <button onClick={toggleTheme} className="text-[#111518] dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-4 pt-2">
                    <div className="flex min-h-[320px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-end pb-8 p-4 relative overflow-hidden shadow-lg transition-all hover:shadow-xl" 
                        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%), url("https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop")' }}>
                        <div className="flex flex-col gap-2 text-center z-10 text-shadow-sm">
                            <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                                남한강변에서의<br/>특별한 삶을 경험하세요
                            </h1>
                            <h2 className="text-white/95 text-sm font-medium leading-normal drop-shadow-sm">
                                VIP 방문예약 및 분양 문의
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="px-4 -mt-2">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-4 flex flex-col gap-6 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary">edit_calendar</span>
                            <h3 className="text-lg font-bold text-[#111518] dark:text-white">예약 정보 입력</h3>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111518] dark:text-gray-300 text-sm font-medium leading-normal">이름</label>
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-[#dce2e5] dark:border-gray-700 bg-white dark:bg-background-dark dark:text-white h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50" 
                                placeholder="성함을 입력해주세요" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#111518] dark:text-gray-300 text-sm font-medium leading-normal">연락처</label>
                            <input 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-[#dce2e5] dark:border-gray-700 bg-white dark:bg-background-dark dark:text-white h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50" 
                                placeholder="010-0000-0000" 
                                type="tel" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#111518] dark:text-gray-300 text-sm font-medium leading-normal">관심 타입</label>
                            <div className="flex gap-3 flex-wrap">
                                <label className="cursor-pointer group relative">
                                    <input 
                                        className="peer sr-only" 
                                        name="interest_type" 
                                        type="radio" 
                                        value="second-house"
                                        checked={interestType === 'second-house'}
                                        onChange={(e) => setInterestType(e.target.value)}
                                    />
                                    <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f3f4] dark:bg-background-dark border border-transparent peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary px-4 transition-all">
                                        <span className="material-symbols-outlined text-[20px] text-gray-500 dark:text-gray-400 peer-checked:text-primary">cottage</span>
                                        <p className="text-[#111518] dark:text-gray-300 peer-checked:text-primary text-sm font-medium">세컨드 하우스</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer group relative">
                                    <input 
                                        className="peer sr-only" 
                                        name="interest_type" 
                                        type="radio" 
                                        value="townhouse"
                                        checked={interestType === 'townhouse'}
                                        onChange={(e) => setInterestType(e.target.value)}
                                    />
                                    <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f3f4] dark:bg-background-dark border border-transparent peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary px-4 transition-all">
                                        <span className="material-symbols-outlined text-[20px] text-gray-500 dark:text-gray-400 peer-checked:text-primary">apartment</span>
                                        <p className="text-[#111518] dark:text-gray-300 peer-checked:text-primary text-sm font-medium">타운하우스</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#111518] dark:text-gray-300 text-sm font-medium leading-normal">방문 희망일</label>
                            <div className="relative">
                                <input 
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-lg border border-[#dce2e5] dark:border-gray-700 bg-white dark:bg-background-dark dark:text-white h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-2 bg-gray-50 dark:bg-background-dark p-3 rounded-lg">
                            <div className="flex h-6 items-center">
                                <input className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" id="consent" name="consent" type="checkbox"/>
                            </div>
                            <div className="text-sm leading-6">
                                <label className="font-medium text-[#111518] dark:text-gray-200" htmlFor="consent">개인정보 수집 및 이용 동의</label>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">방문예약 상담을 위한 개인정보 수집 및 이용에 동의합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white dark:bg-surface-dark border-t border-[#e5e7eb] dark:border-gray-800 p-4 shadow-md z-40 transition-colors">
                <button 
                    onClick={handleSubmit}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                    방문예약 확정 요청
                </button>
            </div>
        </div>
    );
};

export default Booking;