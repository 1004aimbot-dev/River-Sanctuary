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
         <div className="relative w-full h-72 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
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
            className="relative w-full h-72 overflow-hidden cursor-move bg-gray-900 select-none touch-none"
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

const FloorPlanViewer = ({ imageUrl, flip = false, className = "aspect-square" }: { imageUrl: string; flip?: boolean; className?: string }) => {
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

    return (
        <div 
            className={`relative w-full ${className} bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 touch-none select-none group`}
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
                    className={`w-[90%] h-[90%] bg-contain bg-no-repeat bg-center opacity-90 dark:opacity-80 dark:invert-[0.9] pointer-events-none ${flip ? '-scale-x-100' : ''}`}
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
        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            {/* Chart */}
            <div className="relative size-40 shrink-0 select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {slices.map((slice: any) => (
                        <path
                            key={slice.index}
                            d={slice.path}
                            fill={slice.color}
                            className={`transition-all duration-300 cursor-pointer hover:opacity-100 stroke-2 stroke-gray-50 dark:stroke-gray-900 ${activeIndex !== null && activeIndex !== slice.index ? 'opacity-30' : 'opacity-100'}`}
                            onClick={() => setActiveIndex(activeIndex === slice.index ? null : slice.index)}
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

            {/* List */}
            <div className="flex-1 w-full grid grid-cols-1 gap-2">
                {zones.map((zone, i) => (
                    <div 
                        key={i}
                        onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                        className={`
                            flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all duration-200
                            ${activeIndex === i 
                                ? 'bg-white dark:bg-gray-700 border-primary/50 shadow-sm scale-[1.02]' 
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/30'}
                        `}
                    >
                        <div className="flex items-center gap-2.5">
                            <div 
                                className="size-2.5 rounded-full shrink-0" 
                                style={{ backgroundColor: ['#19a1e6', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'][i % 6] }}
                            />
                            <div className="flex flex-col">
                                <span className={`text-xs font-bold ${activeIndex === i ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {zone.name}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className={`text-xs font-bold ${activeIndex === i ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {zone.area}㎡
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const UnitDetailModal = ({ unit, modelName, floorPlanUrl, onClose }: { unit: any; modelName: string; floorPlanUrl: string; onClose: () => void }) => {
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
             <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slideUp max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Modal Header/Image */}
                <div className="relative h-64 bg-gray-200 dark:bg-gray-800">
                    <FloorPlanViewer imageUrl={floorPlanUrl} flip={isFlipped} className="h-full w-full" />
                    
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-20">
                        {unit.status === 'available' ? '분양 가능' : unit.status}
                    </div>
                    <button onClick={onClose} className="absolute top-4 left-4 p-1 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors z-20">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-20 pointer-events-none">
                         <h3 className="text-xl font-bold text-white">{unit.id} <span className="text-sm font-normal opacity-90">({modelName})</span></h3>
                    </div>
                </div>
                
                <div className="p-5 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="text-sm text-gray-600 dark:text-gray-300">분양 가격</div>
                        <div className="text-xl font-extrabold text-primary">{unit.price}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">층수/방향</span>
                            <span className="text-sm font-bold dark:text-white">{unit.floor} / {unit.direction}</span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">전용 면적</span>
                            <span className="text-sm font-bold dark:text-white">84.52㎡ (약 25.6평)</span>
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
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            <span className="font-bold text-gray-900 dark:text-white block mb-1">매니저 코멘트</span>
                            본 호실은 단지 내에서도 가장 선호도가 높은 {unit.direction} 라인에 위치하여 하루 종일 따스한 햇살을 즐기실 수 있습니다.
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 bg-white dark:bg-gray-900">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        닫기
                    </button>
                     <button onClick={() => navigate('/booking')} className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
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
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideUp" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
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
                        <div className="p-3 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 sticky left-0 z-10">
                            <span className="text-xs font-bold text-gray-500">구분</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-primary/5">
                            <span className="text-sm font-bold text-primary">Type-A</span>
                            <span className="text-[10px] text-gray-500">스탠다드</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/10">
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Type-B</span>
                            <span className="text-[10px] text-gray-500">테라스형</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/10">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">Type-C</span>
                            <span className="text-[10px] text-gray-500">패밀리</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900/10">
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">Town T1</span>
                            <span className="text-[10px] text-gray-500">듀플렉스</span>
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
                                <div className="p-3 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 last:border-0 sticky left-0 z-10">
                                    <span className="text-xs font-medium text-gray-500">{row.label}</span>
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
    const [activeTab, setActiveTab] = useState<'overview' | 'options' | 'delivery'>('overview');
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
        'type-t1': "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAWU-WPJUgXnyITRyYhwNw6EU4mCRWzPtMmc9FIXayxT1ncx7Bqxwx9RAdthW8hjwPRbG8StUj-o3BnVZwQZMO9W6YJJiwtzsql3NaFSeSkjUadn8Tn6Mt3wIhgsHbRcB8dAa09RX7x6ReIWaEySI-BbDOYdGNhDvap68wId2NloewU5aAeBMWXOLN10zeptvvTxkXyoSOW4V6wHhgR1fcoxSwVtOmeS81T3d_GzV_QtJTCDHzUfLz0ig1CPqHGoE_78Gp_blVBJ"
    };

    const modelData = {
        'type-a': {
            name: 'Type-A (스탠다드)',
            shortName: 'Type-A',
            exclusive: '84.52',
            exclusivePyeong: '25.6',
            common: '21.15',
            commonPyeong: '6.4',
            total: '105.67',
            totalPyeong: '32.0',
            zones: [
                { name: 'LDK (거실/주방)', area: '32.4', ratio: 45, icon: 'chair' },
                { name: '마스터룸', area: '14.5', ratio: 25, icon: 'bed' },
                { name: '침실 2 / 서재', area: '10.2', ratio: 18, icon: 'single_bed' },
                { name: '욕실 & 파우더룸', area: '6.8', ratio: 12, icon: 'bathtub' },
                { name: '현관/복도', area: '5.2', ratio: 10, icon: 'door_front' },
            ],
            costRange: '1.5억 ~ 3억'
        },
        'type-b': {
            name: 'Type-B (테라스형)',
            shortName: 'Type-B',
            exclusive: '92.40',
            exclusivePyeong: '27.9',
            common: '24.80',
            commonPyeong: '7.5',
            total: '117.20',
            totalPyeong: '35.4',
            zones: [
                { name: 'LDK + 테라스', area: '45.2', ratio: 50, icon: 'deck' },
                { name: '마스터룸', area: '15.5', ratio: 20, icon: 'bed' },
                { name: '침실 2', area: '11.0', ratio: 15, icon: 'single_bed' },
                { name: '욕실 & 스파', area: '8.5', ratio: 10, icon: 'hot_tub' },
                { name: '현관/팬트리', area: '6.5', ratio: 8, icon: 'door_front' },
            ],
            costRange: '2.2억 ~ 3.5억'
        },
        'type-c': {
            name: 'Type-C (패밀리)',
            shortName: 'Type-C',
            exclusive: '115.50',
            exclusivePyeong: '34.9',
            common: '23.00',
            commonPyeong: '6.9',
            total: '138.50',
            totalPyeong: '41.8',
            zones: [
                { name: 'LDK (대면형)', area: '52.0', ratio: 48, icon: 'chair' },
                { name: '마스터룸', area: '18.5', ratio: 18, icon: 'bed' },
                { name: '침실 2', area: '12.0', ratio: 12, icon: 'single_bed' },
                { name: '침실 3', area: '10.5', ratio: 10, icon: 'child_care' },
                { name: '욕실 (2개소)', area: '8.0', ratio: 12, icon: 'bathtub' },
            ],
            costRange: '3.5억 ~ 4.5억'
        },
        'type-t1': {
            name: 'Town T1 (듀플렉스)',
            shortName: 'Town T1',
            exclusive: '130.00',
            exclusivePyeong: '39.3',
            common: '22.00',
            commonPyeong: '6.7',
            total: '152.00',
            totalPyeong: '46.0',
            zones: [
                { name: '1F LDK + 중정', area: '60.0', ratio: 45, icon: 'park' },
                { name: '2F 마스터존', area: '25.5', ratio: 20, icon: 'bed' },
                { name: '2F 서브룸', area: '20.0', ratio: 15, icon: 'single_bed' },
                { name: '프라이빗 가든', area: '30.0', ratio: 0, icon: 'yard' }, // Excluded from chart but listed
                { name: '욕실 (3개소)', area: '10.5', ratio: 20, icon: 'hot_tub' },
            ],
            costRange: '5.2억 ~ 6.5억'
        }
    };
    
    // Mock data for available units
    const unitData: Record<'type-a' | 'type-b' | 'type-c' | 'type-t1', Array<{id: string, floor: string, direction: string, price: string, status: 'available' | 'reserved' | 'sold', isFlipped?: boolean}>> = {
        'type-a': [
            { id: '101호', floor: '1F', direction: '남향', price: '2.8억', status: 'available', isFlipped: false },
            { id: '102호', floor: '1F', direction: '동향', price: '2.7억', status: 'reserved', isFlipped: true },
            { id: '103호', floor: '1F', direction: '남향', price: '2.85억', status: 'available', isFlipped: false },
            { id: '201호', floor: '2F', direction: '남향', price: '2.95억', status: 'sold', isFlipped: true },
        ],
        'type-b': [
            { id: '202호', floor: '2F', direction: '남서향', price: '3.3억', status: 'available', isFlipped: false },
            { id: '203호', floor: '2F', direction: '남향', price: '3.4억', status: 'available', isFlipped: true },
            { id: '301호', floor: '3F', direction: '남향', price: '3.5억', status: 'reserved', isFlipped: false },
        ],
        'type-c': [
            { id: '105호', floor: '1F', direction: '남동향', price: '4.2억', status: 'available', isFlipped: false },
            { id: '205호', floor: '2F', direction: '남향', price: '4.5억', status: 'sold', isFlipped: true },
        ],
        'type-t1': [
            { id: 'T-01', floor: '독채', direction: '남향', price: '6.2억', status: 'available', isFlipped: false },
            { id: 'T-02', floor: '독채', direction: '남서향', price: '6.1억', status: 'available', isFlipped: true },
        ]
    };

    const currentData = modelData[selectedModel];
    const currentUnits = unitData[selectedModel];
    const currentImages = modelImages[selectedModel];

    const displayImage = customHeroImage || currentImages.main;

    const handleUnitSelect = (unit: any) => {
        setActiveUnit(unit);
        setActiveTab('overview');
        // Small delay to ensure tab switch happens before scroll
        setTimeout(() => {
            const viewer = document.getElementById('floor-plan-viewer');
            if (viewer) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-white dark:bg-background-dark transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-surface-dark px-4 py-3 justify-between shadow-sm border-b border-transparent dark:border-gray-800 transition-colors">
                <div onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 cursor-pointer text-[#111518] dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-[#111518] dark:text-white text-lg font-bold leading-tight flex-1 text-center pl-2">{currentData.shortName} 상세정보</h2>
                 <div className="flex gap-1">
                    <div onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 cursor-pointer text-[#111518] dark:text-white">
                        <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 cursor-pointer text-[#111518] dark:text-white">
                        <span className="material-symbols-outlined">share</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            {heroViewMode === '360' ? (
                <PanoramaViewer imageUrl={displayImage} onClose={() => setHeroViewMode('default')} />
            ) : heroViewMode === '3d' ? (
                <ThreeViewer modelType={selectedModel} onClose={() => setHeroViewMode('default')} />
            ) : (
                <div className="relative w-full h-72 bg-gray-200 dark:bg-gray-800 group">
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url("${displayImage}")` }}></div>
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
                    
                    <div className="absolute bottom-4 left-4 flex gap-1 z-10">
                        <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium inline-block">남한강변 뷰</span>
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium inline-block">인기 모델</span>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4 z-20 opacity-90 hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setHeroViewMode('360')}
                            className="flex flex-col items-center gap-2 group/btn"
                        >
                            <div className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">ZK_360</span>
                            </div>
                            <span className="text-white font-bold text-xs drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">360° VR</span>
                        </button>
                        <button 
                            onClick={() => setHeroViewMode('3d')}
                            className="flex flex-col items-center gap-2 group/btn"
                        >
                            <div className="size-14 rounded-full bg-primary/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">view_in_ar</span>
                            </div>
                            <span className="text-white font-bold text-xs drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">3D 모델</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Gallery Carousel */}
            <div className="bg-white dark:bg-surface-dark py-4 border-b dark:border-gray-800 transition-colors">
                <div className="px-4 mb-3 flex justify-between items-end">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">갤러리 투어</h3>
                    <span className="text-xs text-primary font-medium">
                        {currentImages.gallery.length}장의 사진
                    </span>
                </div>
                
                <div className="flex w-full overflow-x-auto no-scrollbar px-4 pb-4 gap-3 snap-x snap-mandatory pt-2">
                    {currentImages.gallery.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => {
                                setCustomHeroImage(item.img);
                                setHeroViewMode('default');
                            }}
                            className={`relative flex-none w-[200px] aspect-[4/3] rounded-xl overflow-hidden snap-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${displayImage === item.img ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''}`}
                        >
                            <img 
                                src={item.img} 
                                alt={item.title} 
                                loading="lazy" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            <span className="absolute bottom-3 left-3 text-white text-sm font-bold shadow-sm">
                                {item.title}
                            </span>
                            {displayImage === item.img && (
                                 <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    선택됨
                                 </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="px-4 py-5 mb-2 dark:text-white">
                <div className="flex flex-col gap-1 mb-4">
                     <div className="flex items-center justify-between">
                         <h1 className="text-2xl font-bold leading-tight">리버사이드 모듈러 {currentData.shortName}</h1>
                         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shrink-0 overflow-x-auto no-scrollbar max-w-[140px] md:max-w-none">
                                {['type-a', 'type-b', 'type-c', 'type-t1'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setSelectedModel(t as any)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${selectedModel === t ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {t === 'type-t1' ? 'Town T1' : t.toUpperCase().replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                     </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">경기도 양평군 · 모듈러 단독주택</p>
                </div>
                
                <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20 mb-5">
                    <p className="text-sm text-primary font-bold mb-1">예상 건축비</p>
                    <h2 className="text-3xl font-extrabold text-[#111518] dark:text-white tracking-tight">{currentData.costRange} <span className="text-base font-medium text-gray-500 dark:text-gray-400">KRW</span></h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">* 대지 비용 별도 / 옵션 선택에 따라 변동</p>
                </div>

                {/* Available Units Section */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">holiday_village</span>
                            분양 가능 호실
                        </h3>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-center">실시간 현황</span>
                    </div>
                    
                    <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
                        {currentUnits.map((unit) => (
                            <div 
                                key={unit.id} 
                                onClick={() => handleUnitSelect(unit)}
                                className={`
                                    min-w-[140px] snap-center p-3 rounded-xl border bg-white dark:bg-surface-dark shadow-sm flex flex-col gap-2 relative overflow-hidden cursor-pointer transition-all
                                    ${activeUnit?.id === unit.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                                `}
                            >
                                {unit.status === 'sold' && <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 z-10 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-lg">분양완료</div>}
                                {unit.status === 'reserved' && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold z-10">예약중</div>}
                                
                                <div className="flex justify-between items-start">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{unit.id}</span>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{unit.floor}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{unit.direction}</span>
                                    <span className={`text-sm font-bold ${unit.status === 'sold' ? 'text-gray-400' : 'text-primary'}`}>{unit.price}</span>
                                </div>

                                <div className="flex gap-1.5 mt-2">
                                     {unit.status === 'available' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedUnit(unit); }}
                                            className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors z-20 relative"
                                        >
                                            상세
                                        </button>
                                     )}
                                     <button 
                                        disabled={unit.status !== 'available'} 
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${unit.status === 'available' ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80' : 'w-full bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                                     >
                                        {unit.status === 'available' ? '상담' : (unit.status === 'reserved' ? '대기신청' : '마감')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    남한강변의 여유를 담은 프리미엄 모듈러 주택입니다. 불필요한 공정을 줄여 합리적인 가격으로 만나는 세컨드 하우스를 제안합니다. 높은 단열 성능과 모던한 디자인이 결합된 {currentData.shortName} 모델입니다.
                </p>
            </div>

            {/* Tabs */}
            <div className="sticky top-[60px] z-40 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex justify-between px-2">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`flex-1 py-3 text-sm transition-colors ${activeTab === 'overview' ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 dark:text-gray-400'}`}
                    >
                        개요/평면
                    </button>
                    <button 
                         onClick={() => setActiveTab('options')} 
                         className={`flex-1 py-3 text-sm transition-colors ${activeTab === 'options' ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 dark:text-gray-400'}`}
                    >
                        상세옵션
                    </button>
                    <button 
                         onClick={() => setActiveTab('delivery')} 
                         className={`flex-1 py-3 text-sm transition-colors ${activeTab === 'delivery' ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 dark:text-gray-400'}`}
                    >
                        납기안내
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                    <div className="px-4 py-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold dark:text-white">공간 구성 & 평면도</h3>
                        </div>
                        
                        <div className="flex flex-col gap-2 mb-6" id="floor-plan-viewer">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                    {activeUnit ? `${activeUnit.id} 평면도` : `${currentData.name} 평면도`}
                                </h4>
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">1:50 Scale</span>
                            </div>
                            
                            <FloorPlanViewer 
                                imageUrl={floorPlanImages[selectedModel]} 
                                flip={activeUnit ? activeUnit.isFlipped : (selectedModel === 'type-b')} 
                            />
                            
                            {activeUnit && (
                                <div className="text-center text-xs text-primary font-bold bg-primary/5 p-2 rounded animate-pulse">
                                    * {activeUnit.id} 맞춤형 평면도가 표시되고 있습니다.
                                </div>
                            )}

                            <button 
                                onClick={() => setIsCompareModalOpen(true)}
                                className="w-full mt-2 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                            >
                                <span className="material-symbols-outlined">compare_arrows</span>
                                전체 모델 라인업 비교하기
                            </button>
                        </div>

                         {/* Detailed Zone Area Breakdown with Interactive Chart */}
                         <div className="mb-6 pt-2">
                            <h3 className="text-lg font-bold dark:text-white mb-4">공간별 상세 면적 (Zone Breakdown)</h3>
                            <ZoneVisualization zones={currentData.zones} />
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">구분</th>
                                        <th className="px-4 py-3 font-medium text-right">면적 (㎡)</th>
                                        <th className="px-4 py-3 font-medium text-right">평형</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-200">
                                    <tr className="bg-white dark:bg-surface-dark">
                                        <td className="px-4 py-3 font-medium">전용 면적</td>
                                        <td className="px-4 py-3 text-right">{currentData.exclusive}</td>
                                        <td className="px-4 py-3 text-right">{currentData.exclusivePyeong}</td>
                                    </tr>
                                    <tr className="bg-white dark:bg-surface-dark">
                                        <td className="px-4 py-3 font-medium">공용 면적</td>
                                        <td className="px-4 py-3 text-right">{currentData.common}</td>
                                        <td className="px-4 py-3 text-right">{currentData.commonPyeong}</td>
                                    </tr>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                        <td className="px-4 py-3 font-bold text-primary">합계</td>
                                        <td className="px-4 py-3 text-right font-bold">{currentData.total}</td>
                                        <td className="px-4 py-3 text-right font-bold">{currentData.totalPyeong}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                         <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-start gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">info</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                * 발코니 확장 면적이 포함된 실사용 면적 기준입니다.<br/>
                                * 세부 치수는 시공 과정에서 일부 변경될 수 있습니다.
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'options' && (
                    <div className="px-4 py-6 flex flex-col gap-6 animate-fadeIn">
                        <div>
                             <h3 className="text-lg font-bold dark:text-white mb-3">기본 제공 옵션</h3>
                             <div className="grid grid-cols-2 gap-3">
                                {[
                                    {icon: 'ac_unit', text: '시스템 에어컨', sub: '거실/안방 (2대)'},
                                    {icon: 'kitchen', text: '빌트인 냉장고', sub: '비스포크 키친핏'},
                                    {icon: 'soup_kitchen', text: '인덕션', sub: '3구 하이브리드'},
                                    {icon: 'door_front', text: '3연동 중문', sub: '단열/소음 차단'},
                                    {icon: 'nest_cam_iq_outdoor', text: 'IoT 월패드', sub: '스마트홈 연동'},
                                    {icon: 'window', text: '시스템 창호', sub: '3중 로이유리'},
                                ].map((opt, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                        <span className="material-symbols-outlined text-primary">{opt.icon}</span>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{opt.text}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.sub}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                        
                        <div>
                             <h3 className="text-lg font-bold dark:text-white mb-3">선택 옵션 (유상)</h3>
                             <ul className="space-y-2">
                                <li className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium dark:text-gray-200">태양광 패널 (3kW)</span>
                                    <span className="text-sm font-bold text-primary">+ 350만</span>
                                </li>
                                <li className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium dark:text-gray-200">야외 자쿠지 설치</span>
                                    <span className="text-sm font-bold text-primary">+ 800만</span>
                                </li>
                                <li className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium dark:text-gray-200">조경 패키지 (프리미엄)</span>
                                    <span className="text-sm font-bold text-primary">+ 1,200만</span>
                                </li>
                             </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'delivery' && (
                    <div className="px-4 py-6 flex flex-col gap-6 animate-fadeIn">
                        <div>
                            <h3 className="text-lg font-bold dark:text-white mb-2">예상 입주 일정</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                계약일로부터 입주까지 <span className="text-primary font-bold">약 2.5개월</span> 소요됩니다.
                                <br/>모듈러 공법으로 빠르고 정확하게 시공합니다.
                            </p>
                            
                            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 py-2">
                                {[
                                    { step: '01', title: '계약 및 인허가', time: '약 2주', desc: '건축 인허가 접수 및 승인 대기' },
                                    { step: '02', title: '공장 제작', time: '약 4주', desc: '스마트 팩토리에서 정밀 제작 진행' },
                                    { step: '03', title: '기초 공사', time: '제작 병행', desc: '현장 토목 및 기초 매트 타설' },
                                    { step: '04', title: '운송 및 설치', time: '3일', desc: '모듈 운송 및 현장 조립' },
                                    { step: '05', title: '마감 및 입주', time: '1주', desc: '내외부 마감, 준공 청소 및 입주' },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-[#111c21]"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-primary tracking-wider">STEP {item.step}</span>
                                            <h4 className="font-bold text-base dark:text-white">{item.title} <span className="text-sm font-normal text-gray-500 ml-1">({item.time})</span></h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                         <div className="p-4 bg-blue-50 dark:bg-primary/10 rounded-xl text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                            <p className="font-bold mb-1">📢 필독 사항</p>
                            기상 악화나 인허가 지연 등 불가피한 사유로 일정이 변경될 수 있습니다. 정확한 일정은 계약 시 담당 매니저와 협의해주세요.
                        </div>
                    </div>
                )}
            </div>
            
            <div className="h-4"></div>
            
             <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-50 transition-colors">
                <div className="flex gap-3">
                    <button onClick={() => navigate('/faq')} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                        상담 문의
                    </button>
                    <button onClick={() => navigate('/booking')} className="flex-[1.5] flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        방문 예약
                    </button>
                </div>
            </div>

            <ComparisonModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
            <UnitDetailModal 
                unit={selectedUnit} 
                modelName={currentData.shortName} 
                floorPlanUrl={floorPlanImages[selectedModel]} 
                onClose={() => setSelectedUnit(null)} 
            />
        </div>
    );
};

export default ProductDetail;