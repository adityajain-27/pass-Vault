import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MouseGlow = () => {
    const glowRef = useRef(null);

    useEffect(() => {
        const glow = glowRef.current;
        if (!glow) return;

        // Create smooth setters for X and Y using GSAP's quickTo
        const xTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

        const handleMouseMove = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
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
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(40px)',
            }}
        />
    );
};

export default MouseGlow;
