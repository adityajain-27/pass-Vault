import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const MouseGlow = () => {
    const glowRef = useRef(null);
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const glow = glowRef.current;
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!glow || !dot || !ring) return;

        // Ensure we handle device types that do not have a fine pointer gracefully
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const xGlow = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
        const yGlow = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });
        
        const xDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power1.out" });
        const yDot = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power1.out" });

        const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "back.out(1.7)" });
        const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "back.out(1.7)" });

        let isHovered = false;
        let hoveredEl = null;
        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            lastX = x;
            lastY = y;
            
            xGlow(x);
            yGlow(y);
            xDot(x);
            yDot(y);

            if (!isHovered) {
                xRing(x);
                yRing(y);
            } else if (hoveredEl) {
                const rect = hoveredEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distanceX = x - centerX;
                const distanceY = y - centerY;
                
                xRing(centerX + distanceX * 0.2);
                yRing(centerY + distanceY * 0.2);
            }
        };

        const handleMouseEnter = (e) => {
            isHovered = true;
            hoveredEl = e.target.closest('a, button, .magnetic, input, select');
            if (hoveredEl) {
                setIsHovering(true);
                gsap.to(ring, {
                    scale: 1.6,
                    opacity: 0.4,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(dot, {
                    scale: 0.5,
                    duration: 0.3
                });
            }
        };

        const handleMouseLeave = () => {
            isHovered = false;
            hoveredEl = null;
            setIsHovering(false);
            
            xRing(lastX);
            yRing(lastY);
            
            gsap.to(ring, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
            gsap.to(dot, {
                scale: 1,
                duration: 0.3
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        const handleGlobalMouseOver = (e) => {
            const target = e.target.closest('a, button, .magnetic, input, select');
            if (target && target !== hoveredEl) {
                handleMouseEnter({ target });
            }
        };
        const handleGlobalMouseOut = (e) => {
            const target = e.target.closest('a, button, .magnetic, input, select');
            if (target) {
                // Check if we are actually leaving the element or just entering a child
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !target.contains(relatedTarget)) {
                    handleMouseLeave();
                }
            }
        };

        window.addEventListener('mouseover', handleGlobalMouseOver);
        window.addEventListener('mouseout', handleGlobalMouseOut);

        // Hide default cursor
        const style = document.createElement('style');
        style.innerHTML = `
            @media (pointer: fine) {
                * { cursor: none !important; }
            }
        `;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleGlobalMouseOver);
            window.removeEventListener('mouseout', handleGlobalMouseOut);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null; // Don't render custom cursor on touch devices
    }

    return (
        <>
            {/* Background Glow */}
            <div 
                ref={glowRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(26,110,245,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(40px)',
                }}
            />
            {/* Outer Ring */}
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    border: '2px solid rgba(245,197,24,0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    transition: 'border-color 0.3s ease',
                    boxShadow: isHovering ? '0 0 15px rgba(245,197,24,0.2)' : 'none',
                    borderColor: isHovering ? '#F5C518' : 'rgba(245,197,24,0.5)',
                    backdropFilter: 'blur(2px)',
                }}
            />
            {/* Inner Dot */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '6px',
                    height: '6px',
                    background: '#F5C518',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 8px rgba(245,197,24,0.8)'
                }}
            />
        </>
    );
};

export default MouseGlow;
