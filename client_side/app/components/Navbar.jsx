'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Container,
    Drawer,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';



const navItems = [
    { label: 'CVs', path: '/cvs' },
    { label: 'Motivation Letters', path: '/motivation-letters' },
    { label: 'Resources', path: '/resources' },
    { label: 'Pricing', path: '/pricing' },
];

// Styled NavLink with underline animation
const NavLink = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isScrolled' && prop !== 'isActive',
})(({ isScrolled, isActive }) => ({
    color: isScrolled ? '#000000' : '#000000',
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 500,
    position: 'relative',
    padding: '8px 16px',
    borderRadius: 0,
    backgroundColor: 'transparent',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 4,
        left: '50%',
        width: isActive ? '70%' : 0,
        height: 3,
        backgroundColor: 'black',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        transform: 'translateX(-50%)',
    },
    '&:hover': {
        backgroundColor: 'transparent',
        '&::after': {
            width: '70%',
        },
    },
}));

// Styled AppBar with scroll effect
const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'isScrolled',
})(({ isScrolled }) => ({
    backgroundColor: isScrolled ? '#EAB308' : 'rgba(252, 248, 241, 0.3)',
    backdropFilter: isScrolled ? 'none' : 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
}));

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { user, isAuthenticated, logoutMutation } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logoutMutation.mutate();
    };


    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Check initial scroll position
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <StyledAppBar
            position="fixed"
            elevation={0}
            isScrolled={isScrolled}
        >
            <Container maxWidth="lg">
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: { xs: 64, lg: isScrolled ? 70 : 80 },
                        transition: 'min-height 0.3s ease',
                    }}
                >
                    {/* Logo */}
                    <Link href="/" passHref>
                        <Box
                            sx={{
                                display: 'flex',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        >
                            <Image
                                src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg"
                                alt="Logo"
                                width={120}
                                height={32}
                                priority
                            />
                        </Box>
                    </Link>

                    {/* Desktop Nav */}
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 2 }}>
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.path} passHref style={{ textDecoration: 'none' }}>
                                <NavLink isScrolled={isScrolled} isActive={pathname === item.path}>
                                    {item.label}
                                </NavLink>
                            </Link>
                        ))}
                    </Box>

                    {/* Desktop CTA */}

                    {isAuthenticated ? (
                        <>
                            <Button
                                onClick={handleMenuOpen}
                                sx={{
                                    display: { xs: 'none', lg: 'inline-flex' },
                                    alignItems: 'center',
                                    gap: 1,
                                    textTransform: 'none',
                                    color: '#000000',
                                }}
                            >
                                <Avatar
                                    src={user?.avatar}
                                    sx={{ width: 32, height: 32, bgcolor: '#667eea' }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography fontWeight={600}>
                                    {user?.name?.split(' ')[0]}
                                </Typography>
                                <KeyboardArrowDownIcon />
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: { mt: 1, minWidth: 180, borderRadius: 2 }
                                }}
                            >
                                <MenuItem
                                    component={Link}
                                    href="/dashboard"
                                    onClick={handleMenuClose}
                                >
                                    <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Dashboard
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    href="/profile"
                                    onClick={handleMenuClose}
                                >
                                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            sx={{
                                display: { xs: 'none', lg: 'inline-flex' },
                                bgcolor: '#000000',
                                color: '#ffffff',
                                borderRadius: '999px',
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#EAB308',
                                    color: '#000000',
                                },
                            }}
                        >
                            Join Now
                        </Button>
                    )}

                    {/* Mobile Menu Icon */}
                    <IconButton
                        onClick={() => setOpen(true)}
                        sx={{
                            display: { lg: 'none' },
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: 'rgba(234, 179, 8, 0.2)',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Mobile Drawer */}
                    <Drawer
                        anchor="right"
                        open={open}
                        onClose={() => setOpen(false)}
                        PaperProps={{
                            sx: {
                                width: 280,
                                backgroundColor: '#ffffff',
                            },
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            {/* Drawer Header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3,
                                    pb: 2,
                                    borderBottom: '1px solid #e2e8f0',
                                }}
                            >
                                <Image
                                    src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg"
                                    alt="Logo"
                                    width={100}
                                    height={28}
                                />
                                <IconButton
                                    onClick={() => setOpen(false)}
                                    sx={{
                                        color: '#000000',
                                        '&:hover': {
                                            backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                        },
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Mobile Nav Links */}
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.path} passHref style={{ textDecoration: 'none' }}>
                                    <Button
                                        fullWidth
                                        onClick={() => setOpen(false)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: '#000000',
                                            textTransform: 'none',
                                            fontSize: 16,
                                            fontWeight: 500,
                                            mb: 1,
                                            py: 1.5,
                                            px: 2,
                                            borderRadius: 2,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 0,
                                                height: '60%',
                                                backgroundColor: '#EAB308',
                                                borderRadius: 1,
                                                transition: 'width 0.3s ease',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                                '&::before': {
                                                    width: 4,
                                                },
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}

                            {/* Mobile CTA */}
                            {isAuthenticated ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            src={user?.avatar}
                                            sx={{ width: 40, height: 40, bgcolor: '#667eea' }}
                                        >
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography fontWeight={600}>
                                            {user?.name}
                                        </Typography>
                                    </Box>

                                    <Button
                                        component={Link}
                                        href="/dashboard"
                                        fullWidth
                                        onClick={() => setOpen(false)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: '#000000',
                                            textTransform: 'none',
                                            mb: 1,
                                            py: 1.5,
                                        }}
                                    >
                                        <DashboardIcon sx={{ mr: 1 }} />
                                        Dashboard
                                    </Button>

                                    <Button
                                        component={Link}
                                        href="/profile"
                                        fullWidth
                                        onClick={() => setOpen(false)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: '#000000',
                                            textTransform: 'none',
                                            mb: 1,
                                            py: 1.5,
                                        }}
                                    >
                                        <PersonIcon sx={{ mr: 1 }} />
                                        Profile
                                    </Button>

                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            setOpen(false);
                                            handleLogout();
                                        }}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: 'error.main',
                                            textTransform: 'none',
                                            py: 1.5,
                                        }}
                                    >
                                        <LogoutIcon sx={{ mr: 1 }} />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    component={Link}
                                    href="/signup"
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setOpen(false)}
                                    sx={{
                                        mt: 3,
                                        bgcolor: '#EAB308',
                                        color: '#000000',
                                        borderRadius: '999px',
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: '#000000',
                                            color: '#ffffff',
                                        },
                                    }}
                                >
                                    Join Now
                                </Button>
                            )}
                        </Box>
                    </Drawer>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
}