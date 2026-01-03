import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Lineup: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [type, setType] = useState<'capsule' | 'townhouse'>('capsule');

    const allProducts = [
        {
            id: 'type-a',
            category: 'capsule',
            name: 'Type A (스탠다드)',
            desc: '컴팩트한 다락방 구조',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc0MsIF5ixqagIQMAqYmZh-cFbVcLI_kircBBnRO9xxwm_FEsV_ZAE8y60HWZ7gBV5Ly8otc0mkybs53bSwM0pvK_Djbu-7Xj1-ksLPlpTlJ3Xec0cKJ_a3XSQNGfJQSE-lFPDPycpQ8OjIZsbcssvDpAC-SBwBZcijxpnui33z-hZb-3hA5jQ9yN0BeAoiefUE7dlhaViOBZbXeyQE5zifUI7ZpKiJkMMU6gw3kZdTBqh8OCcCExii8PU6Yy5-bg7ZOk9s14gyzqx',
            tag: '실속형',
            tagColor: 'bg-black/50',
            area: '10',
            spec: { people: '1-2인', structure: '1룸 + 다락', bath: '1개 (샤워부스)', option: '시스템 에어컨' }
        },
        {
            id: 'type-b',
            category: 'capsule',
            name: 'Type B (테라스형)',
            desc: '넓은 테라스 확장형',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigme8sKohPMtAZ1Vp2Y5hEhM4J58EAUGpzudxxBwhdAUfv4_8Ff8eRHPCsXm324GsIwfAN4CZL3ALF4IzLq1BFeVUlAF-__rWVGK61Ihse4KNf_m5MkciKjeL-em9d4Un9o3LWpsfgAVDJh1qzuUn4ujzp2zz0BaLxpVXYvKtUNYt6LnqqLu3KAzdg1-Oi_dmtN7D_nnWY_lW74WuQGuMaGokcBJLyO7GRpz7-gwPD3PPIEsltzWFfMQHLQstxnOrIbpPfqBQ50FZ',
            tag: '인기',
            tagColor: 'bg-primary',
            area: '12',
            spec: { people: '2-3인', structure: '2룸 + 테라스', bath: '1개 (욕조 포함)', option: '풀옵션 가전' }
        },
        {
            id: 'type-c',
            category: 'capsule',
            name: 'Type C (패밀리)',
            desc: '여유로운 패밀리 구조',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRFHf2BzlktcUcCaW5q8EZoFypPOg1-AkJlU2KLmvc43MJ9eLettdKcLMnztL66hVH3FM44ZRlLT82N8puzWD2MK4UBUmCPr5RUZ0mw9jAKxzJuUQ7rAnYs4RWwh3NNMY0EgYkuMDXQpOsUU0F8mS2fZeLEVBgpfnCnD9XPx-ldal2o2e6a11UjcTgHqMzHmov2He1glM6K-B76St396Hln7zFQXech6s1HTiKOmriOWfFhpW8a2YwZNzMD2umiN8WPN_gLvQAGYI',
            tag: '프리미엄',
            tagColor: 'bg-black/50',
            area: '15',
            spec: { people: '3-4인 (가족형)', structure: '2룸 + 거실 + 정원', bath: '2개 (메인+게스트)', option: '스마트 홈 IoT' }
        },
        {
            id: 'type-t1',
            category: 'townhouse',
            name: 'Town T1 (듀플렉스)',
            desc: '프라이빗 2층 독채',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFrE0F00x1o-GZkbv8XpfY-7eAzRxeoBxUJV_lMLpQE00JTLk-_NeTBLcYu3DDpUy_NPlCJ2qhnZZlBjKA7u0EnmqGiEWpqumR7PCeQGs6RC_7B4F0Yvit56IDQSK6wvRqUT2G-LieonS38V8--JMMIc8fGmkTh0_d33TK8xNAeW7l-DTogpzGHgbyMtPsFfrhIfsthOUj_69ulI3N4yqw4qm68KMaTnWIxo6shckM52WOnIAVrAwZEgaNg2CEtAYlZ1GleBv8_ocx',
            tag: '고급형',
            tagColor: 'bg-indigo-600',
            area: '28',
            spec: { people: '3-4인', structure: '2층 독채 + 마당', bath: '2개 + 파우더룸', option: '빌트인 키친' }
        },
        {
            id: 'type-t2',
            category: 'townhouse',
            name: 'Town T2 (마스터)',
            desc: '럭셔리 풀빌라 타입',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvZvbLGnQOxlJW5_J2R_tabRz39x8Z1MHfYpCZ85QQLCxx70eXyTgktCtwrhkX_4MXGkeuXB8gtkw1U5EyAzkXZMZ5MWlo-Me3aYDxRcz1RBHslOTtBTjAYWiZqj9wA9zj_AG4qasrGGOqwhqemyYqbdOp1Q2AYlLlpYYqMvMPQXGvHLkWj4Dyl9cD7tYfV6L6hrLKc3N66N4vwt-IiCz0M9uZQBGwKiGAn_wb7gKwvUFEsTuxmLEVEMfDVH2wwWsCi3ZecK13Hyxo',
            tag: '하이엔드',
            tagColor: 'bg-slate-800',
            area: '42',
            spec: { people: '5인이상', structure: '3룸 + 루프탑', bath: '3개 (자쿠지)', option: '풀옵션 + 가구' }
        }
    ];

    const products = allProducts.filter(p => p.category === type);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-24 transition-colors">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center px-4 py-3 justify-between">
                    <button onClick={() => navigate(-1)} className="text-[#111518] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-[#111518] dark:text-white text-lg font-bold leading-tight flex-1 text-center">라인업 비교</h2>
                    <button onClick={toggleTheme} className="text-[#111518] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </div>

            {/* Toggle */}
            <div className="bg-white dark:bg-surface-dark px-4 py-4 sticky top-[60px] z-40 shadow-sm">
                <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f0f3f4] dark:bg-gray-800 p-1">
                    <button onClick={() => setType('capsule')} className={`flex cursor-pointer h-full grow items-center justify-center rounded-md transition-all text-sm font-bold ${type === 'capsule' ? 'bg-primary shadow-sm text-white' : 'text-[#637c88] dark:text-gray-400'}`}>
                        <span>캡슐형 (10-15평)</span>
                    </button>
                    <button onClick={() => setType('townhouse')} className={`flex cursor-pointer h-full grow items-center justify-center rounded-md transition-all text-sm font-bold ${type === 'townhouse' ? 'bg-primary shadow-sm text-white' : 'text-[#637c88] dark:text-gray-400'}`}>
                        <span>타운하우스형</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
                <div className="bg-white dark:bg-surface-dark pt-6 px-4 pb-2">
                    <h2 className="text-[#111518] dark:text-white tracking-tight text-2xl font-bold leading-tight">모델 미리보기</h2>
                    <p className="text-[#637c88] dark:text-gray-400 text-sm mt-1">
                        {type === 'capsule' 
                            ? '남한강변의 자연을 품은 3가지 타입의 캡슐 하우스' 
                            : '여유로운 공간과 프라이버시를 보장하는 단독주택'}
                    </p>
                </div>

                {/* Horizontal Scroll Gallery */}
                <div className="flex overflow-x-auto no-scrollbar bg-white dark:bg-surface-dark pb-6 px-4 gap-4 snap-x snap-mandatory">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col gap-3 min-w-[260px] snap-center cursor-pointer group" onClick={() => navigate('/detail')}>
                            <div 
                                className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl shadow-sm relative overflow-hidden group-hover:shadow-md transition-all" 
                                style={{ backgroundImage: `url("${product.image}")` }}
                            >
                                <div className={`absolute top-3 left-3 ${product.tagColor} backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-sm`}>{product.tag}</div>
                            </div>
                            <div>
                                <p className="text-[#111518] dark:text-white text-lg font-bold leading-tight">{product.name}</p>
                                <p className="text-[#637c88] dark:text-gray-400 text-sm font-medium">{product.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Specs */}
                <div className="px-4 py-4 flex flex-col gap-4">
                    <h3 className="text-[#111518] dark:text-white text-lg font-bold">상세 스펙 비교</h3>
                    {products.map((product, idx) => (
                        <div key={product.id} className={`flex flex-col gap-4 rounded-xl border ${idx === 1 && type === 'capsule' ? 'border-2 border-primary/20 bg-white dark:bg-surface-dark shadow-md' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark shadow-sm'} p-5 relative overflow-hidden transition-colors`}>
                            {idx === 1 && type === 'capsule' && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">가성비 최고</div>}
                            <div className="flex flex-col gap-1 z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-primary text-sm font-bold uppercase tracking-wider">{product.id.replace('type-', '').toUpperCase()}</h4>
                                        <h1 className="text-[#111518] dark:text-white text-xl font-bold leading-tight mt-1">{product.name.split(' (')[0]}</h1>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[#111518] dark:text-white text-2xl font-black leading-tight tracking-tight">{product.area}</span>
                                        <span className="text-[#637c88] dark:text-gray-400 text-sm font-bold">평형</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                <SpecItem label="추천 인원" icon="group" value={product.spec.people} />
                                <SpecItem label="구조" icon="meeting_room" value={product.spec.structure} />
                                <SpecItem label="욕실" icon="bathtub" value={product.spec.bath} />
                                <SpecItem label="옵션 포함" icon="check_circle" value={product.spec.option} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-50">
                <button onClick={() => navigate('/booking')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-white shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    <span className="text-base font-bold">모델하우스 방문 예약하기</span>
                </button>
            </div>
        </div>
    );
};

const SpecItem = ({ label, icon, value }: { label: string, icon: string, value: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[#637c88] dark:text-gray-500 text-xs">{label}</span>
        <div className="flex items-center gap-1.5 text-[#111518] dark:text-gray-200 font-medium text-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
            {value}
        </div>
    </div>
);

export default Lineup;