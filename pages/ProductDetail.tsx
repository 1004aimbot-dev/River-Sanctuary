import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeViewer = ({ modelType, onClose }: { modelType: string; onClose: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#111c21'); 
        scene.fog = new THREE.Fog('#111c21', 10, 25);

        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
        camera.position.set(6, 5, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;
        controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
        controls.minDistance = 3;
        controls.maxDistance = 15;
        controlsRef.current = controls;

        // Lights
        const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 20;
        scene.add(dirLight);

        // Procedural House Generation based on modelType
        const houseGroup = new THREE.Group();
        
        const materialWalls = new THREE.MeshStandardMaterial({ color: 0xeaeaea, roughness: 0.8 });
        const materialRoof = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 });
        const materialGlass = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, metalness: 0.9, roughness: 0.1 });
        const materialDeck = new THREE.MeshStandardMaterial({ color: 0xd2a679 });
        const materialFrame = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const createMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true, receiveShadow = true) => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            return mesh;
        };

        if (modelType === 'type-a') {
             // Simple Box House
             const base = createMesh(new THREE.BoxGeometry(3, 2, 2), materialWalls);
             base.position.y = 1;
             houseGroup.add(base);
             
             const roof = createMesh(new THREE.ConeGeometry(2.5, 1, 4), materialRoof);
             roof.position.y = 2.5;
             roof.rotation.y = Math.PI / 4;
             houseGroup.add(roof);

             // Window
             const windowMesh = createMesh(new THREE.PlaneGeometry(1, 1), materialGlass, false, false);
             windowMesh.position.set(0, 1, 1.01);
             houseGroup.add(windowMesh);
             
             // Door
             const door = createMesh(new THREE.BoxGeometry(0.8, 1.5, 0.1), materialFrame);
             door.position.set(0.8, 0.75, 1);
             houseGroup.add(door);

        } else if (modelType === 'type-b') {
             // House with Terrace
             const base = createMesh(new THREE.BoxGeometry(3, 2, 2), materialWalls);
             base.position.y = 1;
             base.position.x = -0.5;
             houseGroup.add(base);

             const terrace = createMesh(new THREE.BoxGeometry(1.5, 0.2, 2), materialDeck);
             terrace.position.set(1.75, 0.1, 0);
             houseGroup.add(terrace);

             // Roof (flat/modern)
             const roof = createMesh(new THREE.BoxGeometry(3.2, 0.2, 2.2), materialRoof);
             roof.position.set(-0.5, 2.1, 0);
             houseGroup.add(roof);

             // Large Window
             const glass = createMesh(new THREE.BoxGeometry(2, 1.5, 0.1), materialGlass);
             glass.position.set(-0.5, 1, 1);
             houseGroup.add(glass);

        } else if (modelType === 'type-c') {
            // L-Shape
            const main = createMesh(new THREE.BoxGeometry(4, 2, 2), materialWalls);
            main.position.y = 1;
            houseGroup.add(main);

            const wing = createMesh(new THREE.BoxGeometry(2, 2, 2), materialWalls);
            wing.position.set(1, 1, 1.5);
            houseGroup.add(wing);

            const roofMain = createMesh(new THREE.BoxGeometry(4.2, 0.2, 2.2), materialRoof);
            roofMain.position.set(0, 2.1, 0);
            houseGroup.add(roofMain);

             const roofWing = createMesh(new THREE.BoxGeometry(2.2, 0.2, 2.2), materialRoof);
            roofWing.position.set(1, 2.1, 1.5);
            houseGroup.add(roofWing);

        } else {
             // 2 Story
             const ground = createMesh(new THREE.BoxGeometry(3, 2, 3), materialWalls);
             ground.position.y = 1;
             houseGroup.add(ground);

             const upper = createMesh(new THREE.BoxGeometry(2.5, 1.8, 2.5), materialWalls);
             upper.position.y = 2.9;
             houseGroup.add(upper);

             const roof = createMesh(new THREE.ConeGeometry(2.5, 1, 4), materialRoof);
             roof.position.y = 4.3;
             roof.rotation.y = Math.PI / 4;
             houseGroup.add(roof);
             
             // Balcony
             const balcony = createMesh(new THREE.BoxGeometry(2.5, 0.1, 0.5), materialDeck);
             balcony.position.set(0, 2, 1.5);
             houseGroup.add(balcony);
        }

        // Ground Plane
        const plane = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshStandardMaterial({ color: 0x1a2630 }));
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        scene.add(houseGroup);

        const animate = () => {
            requestAnimationFrame(animate);
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
             if (containerRef.current) {
                 camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
                 camera.updateProjectionMatrix();
                 renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                 containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };

    }, [modelType]);

    // Handle auto-rotate toggle
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = isAutoRotate;
        }
    }, [isAutoRotate]);

    return (
         <div className="relative w-full h-72 bg-[#111c21] rounded-lg overflow-hidden border border-gray-800">
            <div ref={containerRef} className="w-full h-full" />
             {/* Controls Overlay */}
             <div className="absolute top-4 right-4 z-10">
                <button 
                    onClick={onClose}
                    className="flex items-center justify-center size-8 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
             <div className="absolute bottom-4 left-4 z-10">
                <button 
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold transition-all ${isAutoRotate ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-black/50 text-gray-300 border border-white/10'}`}
                >
                    <span className="material-symbols-outlined text-[16px]">{isAutoRotate ? 'pause' : 'play_arrow'}</span>
                    {isAutoRotate ? '회전 중지' : '자동 회전'}
                </button>
            </div>
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none w-full flex justify-center">
                 <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold shadow-lg border border-white/10">
                     <span className="material-symbols-outlined text-sm">3d_rotation</span>
                     <span>모델을 드래그하여 확인하세요</span>
                 </div>
            </div>
         </div>
    );
};

const PanoramaViewer = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
    const [bgPosition, setBgPosition] = useState(50);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startPos = useRef(0);

    const handleStart = (clientX: number) => {
        isDragging.current = true;
        startX.current = clientX;
        startPos.current = bgPosition;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current) return;
        const delta = clientX - startX.current;
        // Sensitivity factor to control rotation speed
        const sensitivity = 0.2; 
        let newPos = startPos.current - delta * sensitivity;
        
        // Loop the position to simulate infinite 360 rotation
        if (newPos > 100) newPos = newPos % 100;
        if (newPos < 0) newPos = 100 + (newPos % 100);

        setBgPosition(newPos);
    };

    const handleEnd = () => {
        isDragging.current = false;
    };

    return (
        <div 
            className="relative w-full h-72 overflow-hidden cursor-move bg-[#111c21] select-none touch-none"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
        >
            <div 
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    // Using a larger width (e.g., 300%) to simulate a panoramic strip from a standard image
                    backgroundSize: 'auto 110%', 
                    backgroundPosition: `${bgPosition}% center`,
                    transition: isDragging.current ? 'none' : 'background-position 0.1s ease-out',
                }}
            />
            
            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="flex items-center justify-center size-8 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none w-full flex justify-center">
                 <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg border border-white/10">
                     <span className="material-symbols-outlined text-base animate-pulse">360</span>
                     <span>화면을 드래그하여 둘러보세요</span>
                 </div>
            </div>
        </div>
    );
};

const FloorPlanViewer = ({ imageUrl, flip = false, className = "aspect-square", transparent = false }: { imageUrl: string; flip?: boolean; className?: string; transparent?: boolean }) => {
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    
    // Reset state when image changes (e.g. model switch)
    useEffect(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, [imageUrl]);
    
    // Refs for interaction to avoid closure staleness and frequent re-renders during gestures
    const interaction = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        startTranslateX: 0,
        startTranslateY: 0,
        startScale: 1,
        initialDistance: 0,
    });

    // Zoom Buttons
    const zoomIn = () => setScale(s => Math.min(s + 0.5, 4));
    const zoomOut = () => {
        setScale(s => {
            const newScale = Math.max(s - 0.5, 1);
            if (newScale === 1) setTranslate({ x: 0, y: 0 });
            return newScale;
        });
    };

    const updateTranslate = (x: number, y: number) => {
        setTranslate({ x, y });
    };

    // Mouse Events
    const onMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        interaction.current.isDragging = true;
        interaction.current.startX = e.clientX;
        interaction.current.startY = e.clientY;
        interaction.current.startTranslateX = translate.x;
        interaction.current.startTranslateY = translate.y;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!interaction.current.isDragging) return;
        const dx = e.clientX - interaction.current.startX;
        const dy = e.clientY - interaction.current.startY;
        updateTranslate(
            interaction.current.startTranslateX + dx, 
            interaction.current.startTranslateY + dy
        );
    };

    const onMouseUp = () => {
        interaction.current.isDragging = false;
    };

    // Touch Events
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && scale > 1) {
            interaction.current.isDragging = true;
            interaction.current.startX = e.touches[0].clientX;
            interaction.current.startY = e.touches[0].clientY;
            interaction.current.startTranslateX = translate.x;
            interaction.current.startTranslateY = translate.y;
        } else if (e.touches.length === 2) {
            interaction.current.isDragging = false;
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            interaction.current.initialDistance = dist;
            interaction.current.startScale = scale;
        }
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && interaction.current.isDragging) {
            const dx = e.touches[0].clientX - interaction.current.startX;
            const dy = e.touches[0].clientY - interaction.current.startY;
            updateTranslate(
                interaction.current.startTranslateX + dx,
                interaction.current.startTranslateY + dy
            );
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const ratio = dist / interaction.current.initialDistance;
            const newScale = Math.min(Math.max(interaction.current.startScale * ratio, 1), 4);
            setScale(newScale);
            if (newScale === 1) setTranslate({ x: 0, y: 0 });
        }
    };

    const onTouchEnd = () => {
        interaction.current.isDragging = false;
    };

    const containerClasses = transparent 
        ? `relative w-full ${className} touch-none select-none group overflow-hidden`
        : `relative w-full ${className} bg-white dark:bg-[#1c2730] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 touch-none select-none group`;

    return (
        <div 
            className={containerClasses}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out origin-center will-change-transform"
                style={{ 
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                    cursor: scale > 1 ? 'grab' : 'default'
                }}
            >
                <div 
                    className={`w-[90%] h-[90%] bg-contain bg-no-repeat bg-center opacity-90 dark:opacity-80 dark:invert-[0.9] mix-blend-multiply dark:mix-blend-normal pointer-events-none ${flip ? '-scale-x-100' : ''}`}
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                />
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button 
                    onClick={zoomIn} 
                    className="size-10 rounded-full bg-white dark:bg-gray-700 shadow-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                    aria-label="Zoom In"
                >
                    <span className="material-symbols-outlined text-[24px]">add</span>
                </button>
                <button 
                    onClick={zoomOut} 
                    className="size-10 rounded-full bg-white dark:bg-gray-700 shadow-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                    aria-label="Zoom Out"
                >
                    <span className="material-symbols-outlined text-[24px]">remove</span>
                </button>
            </div>
            
            {/* Guide Text */}
            <div className={`absolute top-4 left-4 pointer-events-none transition-opacity duration-300 ${scale > 1 ? 'opacity-0' : 'opacity-100'}`}>
                <span className="bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-medium shadow-sm">
                    확대하여 상세히 보기
                </span>
            </div>
        </div>
    );
};

const ZoneVisualization = ({ zones }: { zones: any[] }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate total ratio to normalize
    const totalRatio = useMemo(() => zones.reduce((acc, zone) => acc + zone.ratio, 0), [zones]);
    // Calculate total area sum for display
    const totalAreaSum = useMemo(() => zones.reduce((acc, zone) => acc + parseFloat(zone.area), 0).toFixed(1), [zones]);

    // Calculate paths
    const slices = useMemo(() => {
        let currentAngle = 0;
        const radius = 40;
        const center = 50;
        
        // Colors for zones
        const colors = [
            '#19a1e6', // Primary
            '#3b82f6', // Blue 500
            '#6366f1', // Indigo 500
            '#8b5cf6', // Violet 500
            '#a855f7', // Purple 500
            '#d946ef'  // Fuchsia 500
        ];

        return zones.map((zone, i) => {
            if (zone.ratio <= 0) return null;
            
            const sliceAngle = (zone.ratio / totalRatio) * 360;
            // Avoid full circle issues if only 1 item
            if (sliceAngle >= 360) {
                 return {
                    path: `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`,
                    color: colors[i % colors.length],
                    data: zone,
                    index: i,
                    startAngle: 0,
                    sliceAngle: 360
                 };
            }

            const x1 = center + radius * Math.cos(Math.PI * (currentAngle - 90) / 180);
            const y1 = center + radius * Math.sin(Math.PI * (currentAngle - 90) / 180);
            const x2 = center + radius * Math.cos(Math.PI * (currentAngle + sliceAngle - 90) / 180);
            const y2 = center + radius * Math.sin(Math.PI * (currentAngle + sliceAngle - 90) / 180);
            
            const largeArc = sliceAngle > 180 ? 1 : 0;
            
            const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            const slice = {
                path: pathData,
                color: colors[i % colors.length],
                data: zone,
                index: i,
                startAngle: currentAngle,
                sliceAngle: sliceAngle
            };
            
            currentAngle += sliceAngle;
            return slice;
        }).filter(Boolean);
    }, [zones, totalRatio]);

    return (
        <div className="flex flex-col items-center gap-4 bg-gray-50 dark:bg-[#111c21]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
                {/* Chart */}
                <div className="relative size-40 shrink-0 select-none mx-auto md:mx-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {slices.map((slice: any) => (
                            <path
                                key={slice.index}
                                d={slice.path}
                                fill={slice.color}
                                className={`transition-all duration-300 cursor-pointer hover:opacity-100 stroke-2 stroke-gray-50 dark:stroke-[#111c21] ${activeIndex !== null && activeIndex !== slice.index ? 'opacity-30' : 'opacity-100'}`}
                                onClick={() => {
                                    setActiveIndex(activeIndex === slice.index ? null : slice.index);
                                    if (!isExpanded) setIsExpanded(true); // Auto expand on interaction
                                }}
                                onMouseEnter={() => setActiveIndex(slice.index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            />
                        ))}
                        {/* Inner Circle for Donut Effect */}
                        <circle cx="50" cy="50" r="28" className="fill-gray-50 dark:fill-[#1a2024]" />
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                            {activeIndex !== null ? '전용면적' : '총 면적'}
                        </span>
                        <span className="text-lg font-extrabold text-[#111518] dark:text-white leading-none mt-0.5">
                            {activeIndex !== null ? zones[activeIndex].area : totalAreaSum}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">㎡</span>
                    </div>
                </div>

                {/* Summary Text (Visible when collapsed) */}
                {!isExpanded && (
                    <div className="flex-1 text-center md:text-left">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">공간 구성 요약</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            이 모델은 총 {zones.length}개의 주요 공간으로 구성되어 있습니다.<br/>
                            자세한 면적 정보는 아래 버튼을 눌러 확인하세요.
                         </p>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1c2730] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all w-full md:w-auto justify-center"
            >
                {isExpanded ? '상세 면적 접기' : '상세 면적 및 비율 보기'}
                <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {/* List (Collapsible) */}
            <div className={`w-full grid grid-cols-1 gap-2 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {zones.map((zone, i) => (
                    <div 
                        key={i}
                        onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                        className={`
                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200
                            ${activeIndex === i 
                                ? 'bg-white dark:bg-[#1c2730] border-primary/50 shadow-sm scale-[1.01]' 
                                : 'bg-white dark:bg-[#111c21] border-gray-100 dark:border-gray-700 hover:border-primary/30'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className="size-3 rounded-full shrink-0 shadow-sm" 
                                style={{ backgroundColor: ['#19a1e6', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'][i % 6] }}
                            />
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${activeIndex === i ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {zone.name}
                                </span>
                                {/* Progress bar background */}
                                <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: `${(zone.ratio / totalRatio) * 100}%`,
                                            backgroundColor: ['#19a1e6', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'][i % 6]
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className={`block text-sm font-bold ${activeIndex === i ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {zone.area}㎡
                            </span>
                             <span className="text-[10px] text-gray-400">
                                {Math.round((zone.ratio / totalRatio) * 100)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const UnitDetailModal = ({ unit, modelName, modelArea, floorPlanUrl, onClose }: { unit: any; modelName: string; modelArea: string; floorPlanUrl: string; onClose: () => void }) => {
    const navigate = useNavigate();
    
    if (!unit) return null;

    // Derived features based on unit properties for demo purposes
    const features = [
        unit.direction + " 채광 및 조망 확보",
        unit.floor === '1F' ? "편리한 진출입 (필로티)" : "탁 트인 리버뷰",
        "시스템 에어컨 무상 옵션",
        "즉시 입주 가능 호실"
    ];

    // Determine flipped state based on unit prop
    const isFlipped = unit.isFlipped;
    
    // Calculate pyeong
    const pyeong = (parseFloat(modelArea) / 3.3058).toFixed(1);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
             <div className="bg-white dark:bg-[#1c2730] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slideUp max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Modal Header/Image */}
                <div className="relative h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {/* Interactive Zoomable FloorPlan */}
                    <FloorPlanViewer 
                        imageUrl={floorPlanUrl} 
                        flip={isFlipped} 
                        className="h-full w-full" 
                        transparent={true}
                    />
                    
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-20">
                        {unit.status === 'available' ? '분양 가능' : unit.status}
                    </div>
                    <button onClick={onClose} className="absolute top-4 left-4 p-1 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 dark:text-white dark:bg-black/30 dark:hover:bg-black/50 transition-colors z-20">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    
                    {isFlipped && (
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
                            <span className="material-symbols-outlined text-[12px]">flip</span>
                            <span>좌우 대칭형 (Mirror)</span>
                        </div>
                    )}
                </div>
                
                <div className="p-5 overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {unit.id} 
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({modelName})</span>
                        </h3>
                    </div>

                    <div className="flex justify-between items-center mb-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="text-sm text-gray-600 dark:text-gray-300">분양 가격</div>
                        <div className="text-xl font-extrabold text-primary">{unit.price}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3 bg-gray-50 dark:bg-[#111c21] rounded-lg border border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">층수/방향</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{unit.floor} / {unit.direction}</span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-[#111c21] rounded-lg border border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">전용 면적</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{modelArea}㎡ (약 {pyeong}평)</span>
                        </div>
                    </div>

                    <div className="mb-5">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                            호실 프리미엄
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <span className="size-1.5 rounded-full bg-primary/60"></span>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-[#111c21] rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            <span className="font-bold text-gray-900 dark:text-white block mb-1">매니저 코멘트</span>
                            본 호실은 단지 내에서도 가장 선호도가 높은 {unit.direction} 라인에 위치하여 하루 종일 따스한 햇살을 즐기실 수 있습니다.
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 bg-white dark:bg-[#1c2730]">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        닫기
                    </button>
                     <button onClick={() => navigate('/booking', { state: { model: modelName } })} className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        상담/방문 예약
                    </button>
                </div>
             </div>
        </div>
    );
};

const ComparisonModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white dark:bg-[#1c2730] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideUp" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1c2730] sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">compare_arrows</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">모델 전체 라인업 비교</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <div className="min-w-[600px] grid grid-cols-[100px_1fr_1fr_1fr_1fr] divide-x divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800">
                         {/* Header Row */}
                        <div className="p-3 flex items-center justify-center bg-gray-50 dark:bg-[#111c21]/50 sticky left-0 z-10">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">구분</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-primary/5">
                            <span className="text-sm font-bold text-primary">Type-A</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">스탠다드</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/10">
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Type-B</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">테라스형</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/10">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">Type-C</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">패밀리</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900/10">
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">Town T1</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">듀플렉스</span>
                        </div>

                        {/* Data Rows */}
                         {[
                            { label: '총 면적', a: '105.67㎡', b: '117.20㎡', c: '138.50㎡', d: '152.00㎡' },
                            { label: '평형', a: '32.0평', b: '35.4평', c: '41.8평', d: '46.0평' },
                            { label: '구조', a: '2룸+2욕실', b: '2룸+테라스', c: '3룸+정원', d: '2층 독채' },
                            { label: '특징', a: '실속 설계', b: '개방감', c: '가족 특화', d: '프라이빗' },
                            { label: '예상 가', a: '1.5억~', b: '2.2억~', c: '3.5억~', d: '5.2억~' },
                        ].map((row, i) => (
                            <React.Fragment key={i}>
                                <div className="p-3 flex items-center justify-center bg-gray-50 dark:bg-[#111c21]/50 border-b border-gray-100 dark:border-gray-800 last:border-0 sticky left-0 z-10">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{row.label}</span>
                                </div>
                                <div className="p-3 flex items-center justify-center text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{row.a}</span>
                                </div>
                                <div className="p-3 flex items-center justify-center text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{row.b}</span>
                                </div>
                                <div className="p-3 flex items-center justify-center text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{row.c}</span>
                                </div>
                                <div className="p-3 flex items-center justify-center text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{row.d}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="p-5 overflow-y-auto">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">모델별 추천 포인트</h4>
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                            <span className="block text-xs font-bold text-primary mb-1">Type-A (스탠다드)</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                합리적인 가격으로 실속 있는 세컨드 하우스를 원하시는 부부에게 최적화된 모델입니다.
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                            <span className="block text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Type-B (테라스형)</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                넓은 테라스에서의 파티나 야외 스파를 즐기며 럭셔리한 휴식을 원하시는 분께 추천합니다.
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                            <span className="block text-xs font-bold text-green-600 dark:text-green-400 mb-1">Type-C (패밀리)</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                4인 이상의 가족이 여유롭게 머물 수 있는 넓은 거실과 정원이 포함된 모델입니다.
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                            <span className="block text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">Town T1 (듀플렉스)</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                완벽한 프라이버시를 보장하는 2층 독채 구조로, 고급스러운 타운하우스 라이프를 제공합니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <button onClick={onClose} className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductDetail: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [heroViewMode, setHeroViewMode] = useState<'default' | '360' | '3d'>('default');
    const [activeTab, setActiveTab] = useState<'overview' | 'options'>('overview');
    const [selectedModel, setSelectedModel] = useState<'type-a' | 'type-b' | 'type-c' | 'type-t1'>('type-a');
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [activeUnit, setActiveUnit] = useState<any>(null); // For previewing in main viewer
    const [customHeroImage, setCustomHeroImage] = useState<string | null>(null);

    // Reset view when model changes
    useEffect(() => {
        setCustomHeroImage(null);
        setHeroViewMode('default');
        setActiveUnit(null);
    }, [selectedModel]);

    // Dynamic Image Data for each model
    const modelImages = {
        'type-a': {
            main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc0MsIF5ixqagIQMAqYmZh-cFbVcLI_kircBBnRO9xxwm_FEsV_ZAE8y60HWZ7gBV5Ly8otc0mkybs53bSwM0pvK_Djbu-7Xj1-ksLPlpTlJ3Xec0cKJ_a3XSQNGfJQSE-lFPDPycpQ8OjIZsbcssvDpAC-SBwBZcijxpnui33z-hZb-3hA5jQ9yN0BeAoiefUE7dlhaViOBZbXeyQE5zifUI7ZpKiJkMMU6gw3kZdTBqh8OCcCExii8PU6Yy5-bg7ZOk9s14gyzqx',
            gallery: [
                { title: '거실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmyL48ODl2nUHfS__lo0Yr362uTXNmyi1KJa7H2sWR6EKBgxwMxbNyvhxjeXoA1RQ-RZcWIK2hmTRe9g8HJWSRSKV1b_cGnho2ob24fVX6TTGjUYbFFAJI9NBJdClwZSNer8im9zdFc10LfOz2SEdk_xRDpQf3BwREEqQiP-xT3xYoyn5D8TnLK-y09sLcEdgC_9a7URFV6FFG4E4VX6a1T1UAPiY0NUOvdyMZive17RUD9GH8rPZgEnntXYc82rg-D3sWxgo0kXa' },
                { title: '주방', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafbLbPHoMU82CDIf-Rk64AcoKSokXgsdo4eT8EOxckj7nKnlwsi5k37Iuc6hFUSEI9JJqsZM8D4jzaEXJ_mxUyJg1vK5_oBezv_qm8ylxI5aJ9Jv1nX39jPLh6wgqGAElKYTCmAh-SxdnX8XIvrCyIe66yEVVsTXx9HSbJk8_1ILSZKx_V5gAGFXabiCBKAXfsK2ZhcWR7yGZM5e1r3ScOvehc8YCzjqt846RXrG9QR8_Ru_G5Nz_piKsBH4WeI03Pc9ssH_iz2oL' },
                { title: '침실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClqlOD3_7W7IrwABjUvX7g7AZfnRa_HjsZPnMma-rbVlpp4ZSY0FImaGnK5uTvzVXm4jWgpA4PTAbJc1u-U6jBk1RcUj6jrJihWZ4yXoGE02vWMHOJ_ZR9WT_Q7eIBVYIWq_PxOFaRtc4Fa8W_fNaOhcc4bdWLNa3W3MrjnothqIVtuwtAj54j8zRyHYA3LwjwmXFUSxd4p52kK91h1S5xMYKXiClg977JzpP6nNLQ_JbolqdVuLD81lKmTr-GTBabMa3uA6ci9wVH' },
                { title: '욕실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNnZ42MfJGuVzojmK_45sKjWmd7Qwzw1to-arKv6iF6Bz8zNoVLcqkkXNqnZbDYm8tOTzV1hTTYY-TDJm1QikQoVCkwegvpA4nUq1ASYqz9LteAHfRXoqkedD-qwAdsWWKWBCG-59vKzr55MF5kcxHoBEnQr3EcI8imD9Vebb3XBB3w5UqEAkdZbT8McDSRa7fTHOojUXXu-7PuNnk09RqEa8-MUgWkluZxDkJ-sJdG-Q_nTbLrR60FcvaVovpRTlNAuf0t6_Gq4-' }
            ]
        },
        'type-b': {
            main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigme8sKohPMtAZ1Vp2Y5hEhM4J58EAUGpzudxxBwhdAUfv4_8Ff8eRHPCsXm324GsIwfAN4CZL3ALF4IzLq1BFeVUlAF-__rWVGK61Ihse4KNf_m5MkciKjeL-em9d4Un9o3LWpsfgAVDJh1qzuUn4ujzp2zz0BaLxpVXYvKtUNYt6LnqqLu3KAzdg1-Oi_dmtN7D_nnWY_lW74WuQGuMaGokcBJLyO7GRpz7-gwPD3PPIEsltzWFfMQHLQstxnOrIbpPfqBQ50FZ',
            gallery: [
                { title: '테라스', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigme8sKohPMtAZ1Vp2Y5hEhM4J58EAUGpzudxxBwhdAUfv4_8Ff8eRHPCsXm324GsIwfAN4CZL3ALF4IzLq1BFeVUlAF-__rWVGK61Ihse4KNf_m5MkciKjeL-em9d4Un9o3LWpsfgAVDJh1qzuUn4ujzp2zz0BaLxpVXYvKtUNYt6LnqqLu3KAzdg1-Oi_dmtN7D_nnWY_lW74WuQGuMaGokcBJLyO7GRpz7-gwPD3PPIEsltzWFfMQHLQstxnOrIbpPfqBQ50FZ' },
                { title: '거실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmyL48ODl2nUHfS__lo0Yr362uTXNmyi1KJa7H2sWR6EKBgxwMxbNyvhxjeXoA1RQ-RZcWIK2hmTRe9g8HJWSRSKV1b_cGnho2ob24fVX6TTGjUYbFFAJI9NBJdClwZSNer8im9zdFc10LfOz2SEdk_xRDpQf3BwREEqQiP-xT3xYoyn5D8TnLK-y09sLcEdgC_9a7URFV6FFG4E4VX6a1T1UAPiY0NUOvdyMZive17RUD9GH8rPZgEnntXYc82rg-D3sWxgo0kXa' },
                { title: '주방', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafbLbPHoMU82CDIf-Rk64AcoKSokXgsdo4eT8EOxckj7nKnlwsi5k37Iuc6hFUSEI9JJqsZM8D4jzaEXJ_mxUyJg1vK5_oBezv_qm8ylxI5aJ9Jv1nX39jPLh6wgqGAElKYTCmAh-SxdnX8XIvrCyIe66yEVVsTXx9HSbJk8_1ILSZKx_V5gAGFXabiCBKAXfsK2ZhcWR7yGZM5e1r3ScOvehc8YCzjqt846RXrG9QR8_Ru_G5Nz_piKsBH4WeI03Pc9ssH_iz2oL' },
                { title: '욕실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNnZ42MfJGuVzojmK_45sKjWmd7Qwzw1to-arKv6iF6Bz8zNoVLcqkkXNqnZbDYm8tOTzV1hTTYY-TDJm1QikQoVCkwegvpA4nUq1ASYqz9LteAHfRXoqkedD-qwAdsWWKWBCG-59vKzr55MF5kcxHoBEnQr3EcI8imD9Vebb3XBB3w5UqEAkdZbT8McDSRa7fTHOojUXXu-7PuNnk09RqEa8-MUgWkluZxDkJ-sJdG-Q_nTbLrR60FcvaVovpRTlNAuf0t6_Gq4-' }
            ]
        },
        'type-c': {
            main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRFHf2BzlktcUcCaW5q8EZoFypPOg1-AkJlU2KLmvc43MJ9eLettdKcLMnztL66hVH3FM44ZRlLT82N8puzWD2MK4UBUmCPr5RUZ0mw9jAKxzJuUQ7rAnYs4RWwh3NNMY0EgYkuMDXQpOsUU0F8mS2fZeLEVBgpfnCnD9XPx-ldal2o2e6a11UjcTgHqMzHmov2He1glM6K-B76St396Hln7zFQXech6s1HTiKOmriOWfFhpW8a2YwZNzMD2umiN8WPN_gLvQAGYI',
            gallery: [
                { title: '전경', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRFHf2BzlktcUcCaW5q8EZoFypPOg1-AkJlU2KLmvc43MJ9eLettdKcLMnztL66hVH3FM44ZRlLT82N8puzWD2MK4UBUmCPr5RUZ0mw9jAKxzJuUQ7rAnYs4RWwh3NNMY0EgYkuMDXQpOsUU0F8mS2fZeLEVBgpfnCnD9XPx-ldal2o2e6a11UjcTgHqMzHmov2He1glM6K-B76St396Hln7zFQXech6s1HTiKOmriOWfFhpW8a2YwZNzMD2umiN8WPN_gLvQAGYI' },
                { title: '거실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmyL48ODl2nUHfS__lo0Yr362uTXNmyi1KJa7H2sWR6EKBgxwMxbNyvhxjeXoA1RQ-RZcWIK2hmTRe9g8HJWSRSKV1b_cGnho2ob24fVX6TTGjUYbFFAJI9NBJdClwZSNer8im9zdFc10LfOz2SEdk_xRDpQf3BwREEqQiP-xT3xYoyn5D8TnLK-y09sLcEdgC_9a7URFV6FFG4E4VX6a1T1UAPiY0NUOvdyMZive17RUD9GH8rPZgEnntXYc82rg-D3sWxgo0kXa' },
                { title: '다이닝', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafbLbPHoMU82CDIf-Rk64AcoKSokXgsdo4eT8EOxckj7nKnlwsi5k37Iuc6hFUSEI9JJqsZM8D4jzaEXJ_mxUyJg1vK5_oBezv_qm8ylxI5aJ9Jv1nX39jPLh6wgqGAElKYTCmAh-SxdnX8XIvrCyIe66yEVVsTXx9HSbJk8_1ILSZKx_V5gAGFXabiCBKAXfsK2ZhcWR7yGZM5e1r3ScOvehc8YCzjqt846RXrG9QR8_Ru_G5Nz_piKsBH4WeI03Pc9ssH_iz2oL' },
                { title: '침실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClqlOD3_7W7IrwABjUvX7g7AZfnRa_HjsZPnMma-rbVlpp4ZSY0FImaGnK5uTvzVXm4jWgpA4PTAbJc1u-U6jBk1RcUj6jrJihWZ4yXoGE02vWMHOJ_ZR9WT_Q7eIBVYIWq_PxOFaRtc4Fa8W_fNaOhcc4bdWLNa3W3MrjnothqIVtuwtAj54j8zRyHYA3LwjwmXFUSxd4p52kK91h1S5xMYKXiClg977JzpP6nNLQ_JbolqdVuLD81lKmTr-GTBabMa3uA6ci9wVH' }
            ]
        },
        'type-t1': {
            main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFrE0F00x1o-GZkbv8XpfY-7eAzRxeoBxUJV_lMLpQE00JTLk-_NeTBLcYu3DDpUy_NPlCJ2qhnZZlBjKA7u0EnmqGiEWpqumR7PCeQGs6RC_7B4F0Yvit56IDQSK6wvRqUT2G-LieonS38V8--JMMIc8fGmkTh0_d33TK8xNAeW7l-DTogpzGHgbyMtPsFfrhIfsthOUj_69ulI3N4yqw4qm68KMaTnWIxo6shckM52WOnIAVrAwZEgaNg2CEtAYlZ1GleBv8_ocx',
            gallery: [
                { title: '중정', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFrE0F00x1o-GZkbv8XpfY-7eAzRxeoBxUJV_lMLpQE00JTLk-_NeTBLcYu3DDpUy_NPlCJ2qhnZZlBjKA7u0EnmqGiEWpqumR7PCeQGs6RC_7B4F0Yvit56IDQSK6wvRqUT2G-LieonS38V8--JMMIc8fGmkTh0_d33TK8xNAeW7l-DTogpzGHgbyMtPsFfrhIfsthOUj_69ulI3N4yqw4qm68KMaTnWIxo6shckM52WOnIAVrAwZEgaNg2CEtAYlZ1GleBv8_ocx' },
                { title: '거실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmyL48ODl2nUHfS__lo0Yr362uTXNmyi1KJa7H2sWR6EKBgxwMxbNyvhxjeXoA1RQ-RZcWIK2hmTRe9g8HJWSRSKV1b_cGnho2ob24fVX6TTGjUYbFFAJI9NBJdClwZSNer8im9zdFc10LfOz2SEdk_xRDpQf3BwREEqQiP-xT3xYoyn5D8TnLK-y09sLcEdgC_9a7URFV6FFG4E4VX6a1T1UAPiY0NUOvdyMZive17RUD9GH8rPZgEnntXYc82rg-D3sWxgo0kXa' },
                { title: '침실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClqlOD3_7W7IrwABjUvX7g7AZfnRa_HjsZPnMma-rbVlpp4ZSY0FImaGnK5uTvzVXm4jWgpA4PTAbJc1u-U6jBk1RcUj6jrJihWZ4yXoGE02vWMHOJ_ZR9WT_Q7eIBVYIWq_PxOFaRtc4Fa8W_fNaOhcc4bdWLNa3W3MrjnothqIVtuwtAj54j8zRyHYA3LwjwmXFUSxd4p52kK91h1S5xMYKXiClg977JzpP6nNLQ_JbolqdVuLD81lKmTr-GTBabMa3uA6ci9wVH' },
                { title: '욕실', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNnZ42MfJGuVzojmK_45sKjWmd7Qwzw1to-arKv6iF6Bz8zNoVLcqkkXNqnZbDYm8tOTzV1hTTYY-TDJm1QikQoVCkwegvpA4nUq1ASYqz9LteAHfRXoqkedD-qwAdsWWKWBCG-59vKzr55MF5kcxHoBEnQr3EcI8imD9Vebb3XBB3w5UqEAkdZbT8McDSRa7fTHOojUXXu-7PuNnk09RqEa8-MUgWkluZxDkJ-sJdG-Q_nTbLrR60FcvaVovpRTlNAuf0t6_Gq4-' }
            ]
        }
    };
    
    // Map of floor plan URLs per model
    const floorPlanImages: Record<'type-a' | 'type-b' | 'type-c' | 'type-t1', string> = {
        'type-a': "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAWU-WPJUgXnyITRyYhwNw6EU4mCRWzPtMmc9FIXayxT1ncx7Bqxwx9RAdthW8hjwPRbG8StUj-o3BnVZwQZMO9W6YJJiwtzsql3NaFSeSkjUadn8Tn6Mt3wIhgsHbRcB8dAa09RX7x6ReIWaEySI-BbDOYdGNhDvap68wId2NloewU5aAeBMWXOLN10zeptvvTxkXyoSOW4V6wHhgR1fcoxSwVtOmeS81T3d_GzV_QtJTCDHzUfLz0ig1CPqHGoE_78Gp_blVBJ",
        'type-b': "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAWU-WPJUgXnyITRyYhwNw6EU4mCRWzPtMmc9FIXayxT1ncx7Bqxwx9RAdthW8hjwPRbG8StUj-o3BnVZwQZMO9W6YJJiwtzsql3NaFSeSkjUadn8Tn6Mt3wIhgsHbRcB8dAa09RX7x6ReIWaEySI-BbDOYdGNhDvap68wId2NloewU5aAeBMWXOLN10zeptvvTxkXyoSOW4V6wHhgR1fcoxSwVtOmeS81T3d_GzV_QtJTCDHzUfLz0ig1CPqHGoE_78Gp_blVBJ",
        'type-c': "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAWU-WPJUgXnyITRyYhwNw6EU4mCRWzPtMmc9FIXayxT1ncx7Bqxwx9RAdthW8hjwPRbG8StUj-o3BnVZwQZMO9W6YJJiwtzsql3NaFSeSkjUadn8Tn6Mt3wIhgsHbRcB8dAa09RX7x6ReIWaEySI-BbDOYdGNhDvap68wId2NloewU5aAeBMWXOLN10zeptvvTxkXyoSOW4V6wHhgR1fcoxSwVtOmeS81T3d_GzV_QtJTCDHzUfLz0ig1CPqHGoE_78Gp_blVBJ",
        'type-t1': "https://lh3.googleusercontent.com/aida-public/AB6AXuDFrE0F00x1o-GZkbv8XpfY-7eAzRxeoBxUJV_lMLpQE00JTLk-_NeTBLcYu3DDpUy_NPlCJ2qhnZZlBjKA7u0EnmqGiEWpqumR7PCeQGs6RC_7B4F0Yvit56IDQSK6wvRqUT2G-LieonS38V8--JMMIc8fGmkTh0_d33TK8xNAeW7l-DTogpzGHgbyMtPsFfrhIfsthOUj_69ulI3N4yqw4qm68KMaTnWIxo6shckM52WOnIAVrAwZEgaNg2CEtAYlZ1GleBv8_ocx"
    };

    const modelData = {
        'type-a': {
            name: 'Type A (스탠다드)',
            desc: '컴팩트한 다락방 구조, 실속형 세컨하우스',
            area: '33.05', // 10평
            price: '1.5억 ~',
            features: [
                { icon: 'bed', text: '1룸 + 다락' },
                { icon: 'shower', text: '욕실 1개' },
                { icon: 'ac_unit', text: '시스템 에어컨' },
            ],
            zones: [
                 { name: '거실/주방', area: '15.5', ratio: 0.47 },
                 { name: '침실', area: '9.0', ratio: 0.27 },
                 { name: '욕실', area: '4.5', ratio: 0.14 },
                 { name: '다락', area: '4.0', ratio: 0.12 },
            ],
            units: [
                { id: '101호', floor: '1F', direction: '남향', price: '1.55억', status: 'available', isFlipped: false },
                { id: '102호', floor: '1F', direction: '남동향', price: '1.52억', status: 'contracted', isFlipped: true },
                { id: '201호', floor: '2F', direction: '남향', price: '1.60억', status: 'available', isFlipped: false },
            ]
        },
        'type-b': {
            name: 'Type B (테라스형)',
            desc: '넓은 테라스가 있는 여유로운 휴식 공간',
            area: '39.66', // 12평
            price: '2.2억 ~',
            features: [
                { icon: 'deck', text: '광폭 테라스' },
                { icon: 'bed', text: '2룸' },
                { icon: 'hot_tub', text: '자쿠지 옵션' },
            ],
            zones: [
                 { name: '거실', area: '14.0', ratio: 0.35 },
                 { name: '주방/다이닝', area: '10.0', ratio: 0.25 },
                 { name: '침실', area: '10.0', ratio: 0.25 },
                 { name: '욕실', area: '5.66', ratio: 0.15 },
            ],
            units: [
                { id: '103호', floor: '1F', direction: '남향', price: '2.25억', status: 'available', isFlipped: false },
                { id: '203호', floor: '2F', direction: '남서향', price: '2.30억', status: 'available', isFlipped: true },
            ]
        },
        'type-c': {
            name: 'Type C (패밀리)',
            desc: '온 가족이 함께 즐기는 넉넉한 공간',
            area: '49.58', // 15평
            price: '3.5억 ~',
            features: [
                { icon: 'family_restroom', text: '3-4인 추천' },
                { icon: 'yard', text: '개별 정원' },
                { icon: 'countertops', text: '아일랜드 주방' },
            ],
            zones: [
                 { name: '거실', area: '18.0', ratio: 0.36 },
                 { name: '주방', area: '12.0', ratio: 0.24 },
                 { name: '마스터룸', area: '12.0', ratio: 0.24 },
                 { name: '게스트룸', area: '7.58', ratio: 0.16 },
            ],
            units: [
                { id: '105호', floor: '1F', direction: '남향', price: '3.6억', status: 'available', isFlipped: false },
            ]
        },
        'type-t1': {
            name: 'Town T1 (듀플렉스)',
            desc: '프라이버시가 보장되는 2층 독채 타운하우스',
            area: '92.56', // 28평
            price: '5.2억 ~',
            features: [
                { icon: 'stairs', text: '2층 독채' },
                { icon: 'fence', text: '프라이빗 마당' },
                { icon: 'bathtub', text: '욕실 2개' },
            ],
            zones: [
                 { name: '1F 거실/주방', area: '45.0', ratio: 0.48 },
                 { name: '2F 마스터존', area: '30.0', ratio: 0.32 },
                 { name: '2F 서브룸', area: '17.56', ratio: 0.20 },
            ],
            units: [
                { id: 'T-01', floor: 'Duplex', direction: '남향', price: '5.5억', status: 'available', isFlipped: false },
                { id: 'T-02', floor: 'Duplex', direction: '남동향', price: '5.3억', status: 'available', isFlipped: true },
            ]
        }
    };

    const currentData = modelData[selectedModel];

    return (
        <div className="relative min-h-screen bg-[#f6f7f8] dark:bg-[#111c21] pb-24 transition-colors text-gray-900 dark:text-gray-100">
            {/* Header with Hero */}
            <header className="relative w-full h-[40vh] min-h-[300px]">
                {heroViewMode === '3d' ? (
                    <ThreeViewer modelType={selectedModel} onClose={() => setHeroViewMode('default')} />
                ) : heroViewMode === '360' ? (
                     <PanoramaViewer imageUrl={customHeroImage || modelImages[selectedModel].main} onClose={() => setHeroViewMode('default')} />
                ) : (
                    <div 
                        className="w-full h-full bg-cover bg-center transition-all duration-500"
                        style={{ backgroundImage: `url("${customHeroImage || modelImages[selectedModel].main}")` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#f6f7f8] dark:to-[#111c21]"></div>
                        
                        {/* Top Nav */}
                        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
                            <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/30 transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setIsCompareModalOpen(true)} className="px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white text-xs font-bold hover:bg-black/30 transition-colors border border-white/10 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                                    비교하기
                                </button>
                                <button onClick={toggleTheme} className="size-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/30 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Hero Controls */}
                        <div className="absolute bottom-6 right-4 flex gap-2 z-10">
                            <button onClick={() => setHeroViewMode('360')} className="size-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-800 dark:text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined">kq</span>
                            </button>
                            <button onClick={() => setHeroViewMode('3d')} className="size-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-800 dark:text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined">view_in_ar</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Content Body */}
            <div className="px-4 -mt-6 relative z-10">
                <div className="bg-white dark:bg-[#1c2730] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-5 mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">{selectedModel.replace('-', ' ').toUpperCase()}</span>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{currentData.name.split(' (')[0]}</h1>
                                <button 
                                    onClick={() => navigate('/booking', { state: { model: selectedModel } })}
                                    className="ml-1 px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-[10px] font-bold transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[14px]">calendar_add_on</span>
                                    방문예약
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentData.desc}</p>
                        </div>
                        <div className="text-right">
                             <span className="block text-xl font-extrabold text-gray-900 dark:text-white">{currentData.price}</span>
                             <span className="text-xs text-gray-400">분양가 (VAT 별도)</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                        {['type-a', 'type-b', 'type-c', 'type-t1'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => setSelectedModel(m as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedModel === m ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-[#111c21] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                            >
                                {m.replace('type-', 'Type ').replace('type-t1', 'Town T1')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4 sticky top-0 bg-[#f6f7f8] dark:bg-[#111c21] z-20 pt-2">
                    {[
                        { id: 'overview', label: '개요/평면/호실' },
                        { id: 'options', label: '옵션/갤러리' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-sm font-bold relative ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex flex-col gap-6 animate-fadeIn">
                    {activeTab === 'overview' && (
                        <>
                            <section className="bg-white dark:bg-[#1c2730] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">fact_check</span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">모델 상세 정보</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-[#111c21] rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 전용 면적</span>
                                            <div className="flex items-end gap-1">
                                                <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">{currentData.area}</span>
                                                <span className="text-sm font-medium text-gray-500 mb-0.5">㎡</span>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1">약 {(parseFloat(currentData.area) / 3.3058).toFixed(1)}평</span>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col justify-center">
                                            <span className="text-xs text-gray-600 dark:text-gray-300 mb-1">분양 가격대</span>
                                            <span className="text-xl font-bold text-primary leading-none">{currentData.price}</span>
                                            <span className="text-xs text-primary/70 mt-1">VAT 별도</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-[#111c21] rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                                        <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Key Features</span>
                                        <div className="space-y-2">
                                            {currentData.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-[18px]">{f.icon}</span>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{f.text}</span>
                                                </div>
                                            ))}
                                            <div className="flex items-start gap-2 pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
                                                 <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">auto_awesome</span>
                                                 <span className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight">{currentData.desc}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">평면도 및 공간 구성</h3>
                                <FloorPlanViewer imageUrl={floorPlanImages[selectedModel]} className="aspect-[4/3] mb-4" />
                                <ZoneVisualization zones={currentData.zones} />
                            </section>
                            
                            {/* Removed redundant specs section as it is now covered in Model Details */}

                            {/* Added Unit List Section to Overview */}
                            <section className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex justify-between items-end mb-3">
                                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">잔여 호실 리스트</h3>
                                   <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">실시간 업데이트</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                   {currentData.units.map((unit) => (
                                       <div 
                                           key={unit.id} 
                                           onClick={() => setSelectedUnit(unit)}
                                           className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                               unit.status === 'contracted' 
                                                   ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 pointer-events-none' 
                                                   : 'bg-white dark:bg-[#1c2730] border-gray-200 dark:border-gray-700 hover:border-primary shadow-sm hover:shadow-md'
                                           }`}
                                       >
                                           <div>
                                               <div className="flex items-center gap-2 mb-1">
                                                   <span className="text-base font-bold text-gray-900 dark:text-white">{unit.id}</span>
                                                   {unit.status === 'contracted' && <span className="text-[10px] bg-gray-500 text-white px-1.5 py-0.5 rounded">분양완료</span>}
                                                   {unit.status === 'available' && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">즉시계약</span>}
                                               </div>
                                               <span className="text-xs text-gray-500 dark:text-gray-400">{unit.floor} • {unit.direction}</span>
                                           </div>
                                           <div className="text-right">
                                               <span className={`block text-sm font-bold ${unit.status === 'contracted' ? 'text-gray-400' : 'text-primary'}`}>{unit.price}</span>
                                               <span className="text-xs text-gray-400 underline">상세보기</span>
                                           </div>
                                       </div>
                                   ))}
                                </div>
                           </section>
                        </>
                    )}

                    {activeTab === 'options' && (
                        <section>
                             <div className="grid grid-cols-2 gap-3">
                                {modelImages[selectedModel].gallery.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer"
                                        onClick={() => setCustomHeroImage(item.img)}
                                    >
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${item.img}")` }}></div>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        <span className="absolute bottom-2 left-2 text-white text-xs font-bold drop-shadow-md">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Modals */}
            <UnitDetailModal 
                unit={selectedUnit} 
                modelName={currentData.name}
                modelArea={currentData.area}
                floorPlanUrl={floorPlanImages[selectedModel]}
                onClose={() => setSelectedUnit(null)} 
            />
            <ComparisonModal 
                isOpen={isCompareModalOpen} 
                onClose={() => setIsCompareModalOpen(false)} 
            />

            {/* CTA */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white dark:bg-[#1c2730] border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-40 transition-colors">
                <button onClick={() => navigate('/booking')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-white shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    <span className="text-base font-bold">모델하우스 방문 예약하기</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;