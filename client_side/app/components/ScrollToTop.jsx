// components/ScrollToTop.jsx
'use client';

import { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Bounce animation
const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-8px);
    }
    60% {
        transform: translateY(-4px);
    }
`;

// Pulse animation
const pulse = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7);
    }
    70% {
        box-shadow: 0 0 0 15px rgba(234, 179, 8, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);
    }
`;

const ScrollButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    backgroundColor: '#EAB308',
    color: '#000000',
    borderRadius: '50%',
    boxShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    animation: `${pulse} 2s infinite`,
    '&:hover': {
        backgroundColor: '#000000',
        color: '#EAB308',
        transform: 'scale(1.1)',
        boxShadow: '0 6px 30px rgba(0, 0, 0, 0.4)',
        animation: `${bounce} 1s ease infinite`,
    },
    [theme.breakpoints.down('sm')]: {
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
    },
}));

const ProgressRing = styled(Box)(({ progress }) => ({
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: '50%',
    background: `conic-gradient(#EAB308 ${progress * 360}deg, transparent 0deg)`,
    opacity: 0.3,
    transition: 'all 0.1s ease',
}));

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / docHeight;
            setScrollProgress(progress);

            // Show button after scrolling 300px
            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Fade in={isVisible}>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    zIndex: 1000,
                }}
            >
                <Tooltip title="Back to top" placement="left" arrow>
                    <Box sx={{ position: 'relative' }}>
                        {/* Progress Ring */}
                        <ProgressRing progress={scrollProgress} />
                        
                        {/* Button */}
                        <ScrollButton
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                        >
                            <KeyboardArrowUpIcon sx={{ fontSize: 30 }} />
                        </ScrollButton>
                    </Box>
                </Tooltip>
            </Box>
        </Fade>
    );
}