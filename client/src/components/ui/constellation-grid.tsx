'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    radius: number;
    label: string;
    pulse: number;
}

export interface ConstellationGridProps {
    className?: string;
    showTitle?: boolean;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    theme?: 'dark' | 'light' | 'auto';
}

export default function ConstellationGrid({
    className = "relative w-full h-full overflow-hidden select-none",
    showTitle = false,
    title = "Constellation",
    description = "High-velocity dynamic mesh. Sweep your cursor or finger across the grid to unleash kinetic shockwaves.",
    children,
    theme = "dark",
}: ConstellationGridProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'high-contrast'>('dark');
    const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

    // Sync theme and accessibility preferences
    useEffect(() => {
        const updateTheme = () => {
            const dataTheme = document.documentElement.getAttribute('data-theme');
            if (dataTheme === 'high-contrast') {
                setThemeMode('high-contrast');
                return;
            }
            if (theme === 'dark') {
                setThemeMode('dark');
                return;
            }
            if (theme === 'light') {
                setThemeMode('light');
                return;
            }
            if (dataTheme === 'dark') {
                setThemeMode('dark');
                return;
            }
            if (dataTheme === 'light') {
                setThemeMode('light');
                return;
            }
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeMode(prefersDark ? 'dark' : 'light');
        };

        const updateMotion = () => {
            const dataMotion = document.documentElement.getAttribute('data-reduced-motion');
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            setIsReducedMotion(dataMotion === 'true' || prefersReduced);
        };

        updateTheme();
        updateMotion();

        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleColorChange = () => updateTheme();
        const handleMotionChange = () => updateMotion();

        colorSchemeQuery.addEventListener('change', handleColorChange);
        motionQuery.addEventListener('change', handleMotionChange);

        const observer = new MutationObserver(() => {
            updateTheme();
            updateMotion();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'data-reduced-motion'],
        });

        return () => {
            colorSchemeQuery.removeEventListener('change', handleColorChange);
            motionQuery.removeEventListener('change', handleMotionChange);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Pointer velocity & inertial tracking (mouse & touch unified)
        const pointer = {
            x: -2000,
            y: -2000,
            prevX: -2000,
            prevY: -2000,
            vx: 0,
            vy: 0,
            radius: 200,
            active: false,
        };

        let nodes: Node[] = [];

        const updateDimensionsAndRadius = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const isMobile = width < 768;
            pointer.radius = isMobile ? 120 : 200;
        };

        const initNodes = () => {
            nodes = [];
            const isMobile = width < 768;
            const spacing = isMobile ? 62 : 55;
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    nodes.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 1.1 + (isMobile ? 1.0 : 1.2),
                        label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            updateDimensionsAndRadius();
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            initNodes();
        };

        // Desktop mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.active = true;
        };

        const handleMouseLeave = () => {
            pointer.x = -2000;
            pointer.y = -2000;
            pointer.active = false;
        };

        // Mobile touch tracking
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                pointer.x = touch.clientX;
                pointer.y = touch.clientY;
                pointer.prevX = touch.clientX;
                pointer.prevY = touch.clientY;
                pointer.vx = 0;
                pointer.vy = 0;
                pointer.active = true;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                pointer.x = touch.clientX;
                pointer.y = touch.clientY;
                pointer.active = true;
            }
        };

        const handleTouchEnd = () => {
            pointer.x = -2000;
            pointer.y = -2000;
            pointer.active = false;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        let lastTime = performance.now();

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            // Velocity calculation with off-screen protection
            if (!pointer.active || pointer.prevX < -500 || pointer.x < -500) {
                pointer.vx = 0;
                pointer.vy = 0;
                pointer.prevX = pointer.x;
                pointer.prevY = pointer.y;
            } else {
                pointer.vx = (pointer.x - pointer.prevX) / (dt * 1000 || 1);
                pointer.vy = (pointer.y - pointer.prevY) / (dt * 1000 || 1);
                pointer.prevX = pointer.x;
                pointer.prevY = pointer.y;
            }

            const speed = Math.sqrt(pointer.vx * pointer.vx + pointer.vy * pointer.vy);

            // Adaptive color palette
            let bgColor = '#030407';
            let nodeColor = '255, 255, 255';
            let accentColor = '56, 189, 248'; // Cyan

            if (themeMode === 'high-contrast') {
                bgColor = '#000000';
                nodeColor = '255, 255, 0';
                accentColor = '250, 204, 21';
            } else if (themeMode === 'light') {
                bgColor = '#f8fafc';
                nodeColor = '15, 23, 42';
                accentColor = '2, 132, 199';
            }

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            // Hooke's Law Spring-Mass-Damping system
            const isMobile = width < 768;
            const SPRING_K = isReducedMotion ? 8 : 18;
            const DAMPING = isReducedMotion ? 0.70 : 0.82;
            const baseForceMultiplier = isMobile ? 1000 : 1500;
            const speedForceMultiplier = isMobile ? 80 : 150;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += dt * (isReducedMotion ? 1 : 3);

                if (!isReducedMotion) {
                    const dx = pointer.x - n.x;
                    const dy = pointer.y - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < pointer.radius && dist > 0) {
                        const power = (1 - dist / pointer.radius);
                        const force = power * (baseForceMultiplier + speed * speedForceMultiplier);
                        const angle = Math.atan2(dy, dx);

                        n.vx -= Math.cos(angle) * force * dt;
                        n.vy -= Math.sin(angle) * force * dt;
                    }
                }

                const homeDx = n.baseX - n.x;
                const homeDy = n.baseY - n.y;

                n.vx += homeDx * SPRING_K * dt;
                n.vy += homeDy * SPRING_K * dt;

                n.vx *= DAMPING;
                n.vy *= DAMPING;

                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;
            }

            // Draw Connections
            const MAX_CONN_DIST = isMobile ? 70 : 75;
            const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const ndx = n.x - n2.x;
                    const ndy = n.y - n2.y;
                    const distSq = ndx * ndx + ndy * ndy;

                    if (distSq < MAX_CONN_DIST_SQ) {
                        const nDist = Math.sqrt(distSq);
                        const alpha = (1 - nDist / MAX_CONN_DIST) * (themeMode === 'light' ? 0.12 : 0.20);

                        ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }
            }

            // Render Nodes & Radar Rings
            const radarDistance = isMobile ? 65 : 90;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = pointer.x - n.x;
                const dy = pointer.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const isNear = dist < pointer.radius && pointer.active;

                const baseAlpha = isNear ? 0.95 : 0.25 + Math.sin(n.pulse) * 0.1;

                ctx.fillStyle = isNear
                    ? `rgba(${accentColor}, ${baseAlpha})`
                    : `rgba(${nodeColor}, ${baseAlpha})`;

                const currentRadius = isNear
                    ? n.radius * 2.0
                    : n.radius + Math.sin(n.pulse) * 0.25;

                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                // High-tech Spatial Radar Rings on active proximity
                if (isNear && dist < radarDistance && !isReducedMotion) {
                    const pulseRing = ((n.pulse * 18) % 28) + 4;
                    const ringAlpha = (1 - pulseRing / 32) * 0.45;

                    ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();

                    // Coordinates Readout
                    ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                    ctx.fillStyle = `rgba(${accentColor}, 0.85)`;
                    ctx.fillText(n.label, n.x + 8, n.y - 8);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [themeMode, isReducedMotion]);

    return (
        <div className={`${className} select-none`} aria-hidden={!showTitle && !children}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full pointer-events-none"
            />

            {showTitle && (
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pointer-events-none mix-blend-difference text-white">
                    <h1 className="font-mono text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        {title}
                    </h1>
                    <p className="mt-4 font-mono text-xs md:text-sm max-w-lg opacity-70">
                        {description}
                    </p>
                </div>
            )}

            {children && (
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            )}
        </div>
    );
}
