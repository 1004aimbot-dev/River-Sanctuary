import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

declare global {
    interface Window {
        L: any;
    }
}

const Location: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    // Amenities Data
    const amenities = [
        { pos: [37.494, 127.493], icon: 'train', color: '#64748b', name: '양평역 (KTX)', distance: '1.2km', category: '교통' },
        { pos: [37.489, 127.485], icon: 'school', color: '#f59e0b', name: '양평초등학교', distance: '800m', category: '교육' },
        { pos: [37.496, 127.482], icon: 'park', color: '#10b981', name: '갈산공원', distance: '1.5km', category: '공원' },
        { pos: [37.490, 127.495], icon: 'local_hospital', color: '#ef4444', name: '양평병원', distance: '600m', category: '의료' },
        { pos: [37.492, 127.490], icon: 'shopping_cart', color: '#8b5cf6', name: '하나로마트', distance: '500m', category: '편의' },
    ];

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current || !window.L) return;

        const L = window.L;
        // Coordinates for Yangpyeong (Demo location)
        const center: [number, number] = [37.4915, 127.4890]; 

        const map = L.map(mapContainerRef.current, {
            center: center,
            zoom: 14,
            zoomControl: false,
            attributionControl: false
        });

        // CartoDB Voyager Tiles (Clean, good for real estate)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Helper to create custom marker icons
        const createCustomIcon = (iconName: string, bgColor: string) => {
            return L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        <div style="
                            width: 36px; 
                            height: 36px; 
                            background-color: ${bgColor}; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                            border: 2px solid white;
                            z-index: 2;
                        ">
                            <span class="material-symbols-outlined" style="color: white; font-size: 20px;">${iconName}</span>
                        </div>
                        <div style="
                            position: absolute; 
                            bottom: 0px; 
                            width: 0; 
                            height: 0; 
                            border-left: 8px solid transparent;
                            border-right: 8px solid transparent;
                            border-top: 12px solid ${bgColor};
                            z-index: 1;
                        "></div>
                    </div>
                `,
                iconSize: [40, 48],
                iconAnchor: [20, 48],
                popupAnchor: [0, -48]
            });
        };

        // Main Property Marker
        const mainMarker = L.marker(center, { 
            icon: createCustomIcon('home_pin', '#19a1e6'),
            zIndexOffset: 1000 
        }).addTo(map);
        
        mainMarker.bindPopup(`
            <div style="text-align: center; font-family: sans-serif;">
                <b style="font-size: 14px; color: #111518;">더 리버 에스테이트</b><br>
                <span style="font-size: 12px; color: #64748b;">경기도 양평군 남한강변</span>
            </div>
        `, { closeButton: false }).openPopup();

        // Add amenity markers
        amenities.forEach(item => {
            L.marker(item.pos as [number, number], { 
                icon: createCustomIcon(item.icon, item.color) 
            }).addTo(map).bindPopup(`
                <div style="text-align: center; font-family: sans-serif;">
                    <span style="font-size: 12px; font-weight: bold; color: #111518;">${item.name}</span>
                </div>
            `, { closeButton: false });
        });

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24 transition-colors">
            <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md px-4 py-3 justify-between shadow-sm transition-colors">
                <button onClick={() => navigate(-1)} className="text-[#111518] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-[#111518] dark:text-white text-lg font-bold leading-tight flex-1 text-center">입지/뷰</h2>
                <button onClick={toggleTheme} className="text-[#111518] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800">
                    <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </header>

            <section className="mt-2">
                <div className="px-4 pt-6 pb-2">
                    <h2 className="text-[#111518] dark:text-white tracking-tight text-[26px] font-extrabold leading-tight break-keep">프리미엄 리버프론트 라이프</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 break-keep">남한강의 다채로운 변화를 매일 아침 경험하세요</p>
                </div>
                
                <div className="flex overflow-y-auto no-scrollbar snap-x snap-mandatory px-4 pb-6 gap-4 pt-2">
                    {[
                        { time: '오전 07:00', title: '아침', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAuNC_udjijihLbenAcOkr36qndgGjJkZgnCSE5XPEAX_QIfg-o0qwEfimHHWSqmryhZ9CVpDqoXy9k4H1mH6l3cCcY5I13UKzrRJ0SXhkJ4PlX5cYtCL5hNyK4UiIVJCY2Rl1-IykHkKmWm0GeZ3xMXulOFr5Ax8bzFq-s6Z_hTv5MxY4yZ18CGK4O0T3_bU47QY9gX6hgSB2CsDy3g6WD0eAZqBvjD3rC8Lc3BDttCcg_yCpPRtyFKDlEx9t_OX0dBlXiH0wgUzo', desc: '물안개가 피어오르는 고요한 아침, 한 폭의 수묵화 같은 풍경으로 하루를 시작하세요.', color: 'bg-primary/90' },
                        { time: '오후 06:00', title: '노을', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqfYB2CXUm-vozq1LDcJ5alNNDaSD4oeSlCh3-R5ai02llAEM7WZ7p_6EsEWljaOMTiYMtLgWS6qqJZaVJnjz84ybxkoKWg8yCFVzDOs8zZhjrGuw-7-jBvrdAfyI2tlP1yj5iAbrPOjqjBaIamepTQdvQaUGav2O-_FhcXSBFeaJRVphT2dJdlFQxBQ5c2lZkB_4lpentjHxhzZKii6aVp2C-5ssqUKIWngMSVRqKSXMryEvCXzj-k6WXsXR6IXwoZeMub3jLZqJg', desc: '자연이 선사하는 가장 아름다운 빛, 황금빛 노을이 거실 가득 따스함을 채웁니다.', color: 'bg-orange-500/90' },
                        { time: '오후 09:00', title: '야경', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjTDAIBs--EtIaBO41dvcGL3XXhe9NcWCE_ESEHpyZbroXflEn-Unee3l9gwsDcnRV9uQI77s5w35LnJ5OsP_3RPeaZFPIt0KsyZ0XULtLRr4gz6WwMJCGAxhdRssBPt_0gnqwVPsXQGU75h22h2XHRG9EAsbupKRjGEuZCXQEox72wH-r9GX7X8-9SeWVnS_Os8UvM9c9kek_JCVsx_Xs7ndmjAtX-zFgqHpNPLQC0dlOlv7sD9PcsdqQq5lVy_wVWTr0zcSNfiNz', desc: '고요한 강물 위로 비치는 별빛과 도시의 불빛이 선사하는 평온한 휴식을 즐기세요.', color: 'bg-indigo-500/90' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-3 min-w-[85%] snap-center group">
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${item.img}")` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className={`${item.color} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block`}>{item.time}</span>
                                    <p className="text-white text-xl font-bold leading-tight">{item.title}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-1 break-keep">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 my-2 transition-colors"></div>

            <section className="flex flex-col py-6">
                <div className="px-4 mb-4">
                    <h3 className="text-[#111518] dark:text-white tracking-tight text-xl font-bold leading-tight">위치 및 주변 인프라</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal mt-1">서종IC 5분 • KTX 양평역 7분</p>
                </div>
                <div className="px-4">
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 z-0">
                        <div ref={mapContainerRef} className="w-full h-full bg-gray-100 dark:bg-gray-800" />
                        
                        <div className="absolute bottom-4 left-3 right-3 flex gap-2 overflow-x-auto no-scrollbar pb-1 z-[400]">
                            <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm p-3 rounded-xl shadow-md flex flex-col min-w-[100px] flex-1 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-primary text-[18px]">directions_car</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">강남</span>
                                </div>
                                <span className="text-[#111518] dark:text-white font-bold text-lg">45 <span className="text-xs font-normal">분</span></span>
                            </div>
                             <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm p-3 rounded-xl shadow-md flex flex-col min-w-[100px] flex-1 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-primary text-[18px]">train</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">KTX</span>
                                </div>
                                <span className="text-[#111518] dark:text-white font-bold text-lg">7 <span className="text-xs font-normal">분</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-6">
                    <h3 className="text-[#111518] dark:text-white text-lg font-bold mb-3">주요 편의시설</h3>
                    <div className="flex flex-col gap-3">
                        {amenities.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="size-10 rounded-full flex items-center justify-center text-white shadow-sm" 
                                        style={{ backgroundColor: item.color }}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#111518] dark:text-white font-bold text-sm">{item.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">{item.category}</span>
                                    </div>
                                </div>
                                <span className="text-primary font-bold text-sm bg-primary/5 px-2 py-1 rounded-md">{item.distance}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Location;