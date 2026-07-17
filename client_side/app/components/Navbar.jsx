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
import { useLanguage } from '../hooks/useLanguage';
import { LANGUAGES } from '../locales';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';



const navItems = [
    { labelKey: 'nav.cvs', path: '/cvs' },
    { labelKey: 'nav.motivationLetters', path: '/motivation-letters' },
    { labelKey: 'nav.resources', path: '/resources' },
    { labelKey: 'nav.pricing', path: '/pricing' },
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
    const { user, isAuthenticated, loading: authLoading, logoutMutation } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const langMenuOpen = Boolean(langAnchorEl);

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

    const handleLangMenuOpen = (event) => {
        setLangAnchorEl(event.currentTarget);
    };

    const handleLangMenuClose = () => {
        setLangAnchorEl(null);
    };

    const handleSelectLanguage = (code) => {
        setLanguage(code);
        handleLangMenuClose();
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
                            <Link key={item.labelKey} href={item.path} passHref style={{ textDecoration: 'none' }}>
                                <NavLink isScrolled={isScrolled} isActive={pathname === item.path}>
                                    {t(item.labelKey)}
                                </NavLink>
                            </Link>
                        ))}
                    </Box>

                    {/* Language Switcher */}
                    <Button
                        onClick={handleLangMenuOpen}
                        startIcon={<LanguageIcon sx={{ fontSize: 18 }} />}
                        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            display: { xs: 'none', lg: 'inline-flex' },
                            textTransform: 'none',
                            color: '#000000',
                            fontWeight: 600,
                            minWidth: 0,
                            mr: 1,
                        }}
                    >
                        {language.toUpperCase()}
                    </Button>
                    <Menu
                        anchorEl={langAnchorEl}
                        open={langMenuOpen}
                        onClose={handleLangMenuClose}
                        PaperProps={{
                            sx: { mt: 1, minWidth: 160, borderRadius: 2 }
                        }}
                    >
                        {LANGUAGES.map((lng) => (
                            <MenuItem
                                key={lng.code}
                                selected={language === lng.code}
                                onClick={() => handleSelectLanguage(lng.code)}
                                sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
                            >
                                {lng.label}
                                {language === lng.code && <CheckIcon sx={{ fontSize: 18, color: '#EAB308' }} />}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Desktop CTA */}

                    {authLoading ? (
                        <Box
                            sx={{
                                display: { xs: 'none', lg: 'block' },
                                width: 140,
                                height: 40,
                                borderRadius: '999px',
                                bgcolor: 'rgba(0, 0, 0, 0.06)',
                            }}
                        />
                    ) : isAuthenticated ? (
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
                                    sx={{ width: 32, height: 32, bgcolor: '#000000' }}
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
                                    {t('nav.dashboard')}
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    href="/settings"
                                    onClick={handleMenuClose}
                                >
                                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                    {t('nav.profile')}
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                                    {t('nav.logout')}
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
                            {t('nav.joinNow')}
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

                            {/* Mobile Language Switcher */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                {LANGUAGES.map((lng) => (
                                    <Button
                                        key={lng.code}
                                        fullWidth
                                        onClick={() => setLanguage(lng.code)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: language === lng.code ? '#EAB308' : '#e2e8f0',
                                            color: language === lng.code ? '#000000' : '#64748b',
                                            bgcolor: language === lng.code ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                                        }}
                                    >
                                        {lng.code.toUpperCase()}
                                    </Button>
                                ))}
                            </Box>

                            {/* Mobile Nav Links */}
                            {navItems.map((item) => (
                                <Link key={item.labelKey} href={item.path} passHref style={{ textDecoration: 'none' }}>
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
                                        {t(item.labelKey)}
                                    </Button>
                                </Link>
                            ))}

                            {/* Mobile CTA */}
                            {authLoading ? (
                                <Box sx={{ width: '100%', height: 44, borderRadius: 2, bgcolor: 'rgba(0, 0, 0, 0.06)' }} />
                            ) : isAuthenticated ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            src={user?.avatar}
                                            sx={{ width: 40, height: 40, bgcolor: '#000000' }}
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
                                        {t('nav.dashboard')}
                                    </Button>

                                    <Button
                                        component={Link}
                                        href="/settings"
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
                                        {t('nav.profile')}
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
                                        {t('nav.logout')}
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
                                    {t('nav.joinNow')}
                                </Button>
                            )}
                        </Box>
                    </Drawer>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
}