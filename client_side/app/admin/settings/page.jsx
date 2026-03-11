'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Avatar,
    Button,
    Switch,
    Slider,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import RestoreIcon from '@mui/icons-material/Restore';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaletteIcon from '@mui/icons-material/Palette';
import BrushIcon from '@mui/icons-material/Brush';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ShieldIcon from '@mui/icons-material/Shield';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ExtensionIcon from '@mui/icons-material/Extension';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import TuneIcon from '@mui/icons-material/Tune';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import BackupIcon from '@mui/icons-material/Backup';

// ─── Section Card Component ───
const SettingsSection = ({ icon, title, description, children, color = '#667eea' }) => (
    <Box
        sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
        }}
    >
        <Box
            sx={{
                p: 2.5,
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body1" fontWeight="700" color="#1e293b">
                    {title}
                </Typography>
                {description && (
                    <Typography variant="caption" color="#94a3b8">
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {children}
        </Box>
    </Box>
);

// ─── Setting Row ───
const SettingRow = ({ label, description, children, noBorder }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 },
            pb: noBorder ? 0 : 2,
            borderBottom: noBorder ? 'none' : '1px solid #f1f5f9',
        }}
    >
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="600" color="#1e293b">
                {label}
            </Typography>
            {description && (
                <Typography variant="caption" color="#94a3b8">
                    {description}
                </Typography>
            )}
        </Box>
        <Box sx={{ minWidth: { sm: 280 }, width: { xs: '100%', sm: 'auto' } }}>
            {children}
        </Box>
    </Box>
);

// ─── Feature Toggle ───
const FeatureToggle = ({ label, description, enabled, onChange, color = '#667eea', icon }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: enabled ? `${color}06` : '#f8fafc',
            border: `1px solid ${enabled ? `${color}20` : '#f1f5f9'}`,
            transition: 'all 0.2s ease',
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon && (
                <Box sx={{ color: enabled ? color : '#94a3b8', '& .MuiSvgIcon-root': { fontSize: 20 } }}>
                    {icon}
                </Box>
            )}
            <Box>
                <Typography variant="body2" fontWeight="600" color={enabled ? '#1e293b' : '#64748b'}>
                    {label}
                </Typography>
                {description && (
                    <Typography variant="caption" color="#94a3b8">
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
        <Box>
            <Switch
                checked={enabled}
                onChange={onChange}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: color },
                }}
            />
        </Box>
    </Box>
);

export default function AdminSettingsPage() {
    // ─── State ───
    const [activeTab, setActiveTab] = useState('general');
    const [hasChanges, setHasChanges] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Settings State ───
    const [settings, setSettings] = useState({
        // General
        platformName: 'CVBuilder Pro',
        tagline: 'Build professional CVs in minutes',
        contactEmail: 'support@cvbuilder.pro',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Innovation Street, Tech City, TC 10001',
        website: 'https://cvbuilder.pro',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',

        // CV / Template
        defaultFreeCVLimit: 3,
        maxFreeCVLimit: 5,
        defaultTemplate: 'professional',
        allowCustomColors: true,
        allowCustomFonts: true,
        availableFormats: ['pdf'],
        maxCVPages: 3,
        autoSaveInterval: 30,

        // Premium / Pricing
        premiumMonthlyPrice: 9.99,
        premiumAnnualPrice: 79.99,
        currency: 'USD',
        trialDays: 7,
        enableFreeTrial: true,
        paymentMethods: ['credit_card', 'paypal'],
        autoRenew: true,
        refundPeriodDays: 14,

        // Features
        enableAIAssistant: true,
        enableCVSharing: true,
        enableAnalytics: true,
        enablePublicProfile: false,
        enableMultiLanguageCV: true,
        enableCoverLetter: true,
        enableExportWord: false,
        enableExportPNG: true,
        enableWatermark: false,
        enableTemplateCustomization: true,
        maintenanceMode: false,
        enableRegistration: true,

        // Security
        maxLoginAttempts: 5,
        sessionTimeout: 60,
        requireEmailVerification: true,
        require2FA: false,
        passwordMinLength: 8,
        allowSocialLogin: true,
        allowGoogleLogin: true,
        allowLinkedInLogin: true,

        // Storage / Limits
        maxFileUploadSize: 5,
        maxStoragePerUser: 100,
        enableCloudBackup: true,
        backupFrequency: 'daily',
    });

    // Track initial state for reset
    const [initialSettings] = useState({ ...settings });

    const updateSetting = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        setHasChanges(false);
        setSnackbar({ open: true, message: 'Settings saved successfully! ✅', severity: 'success' });
    };

    const handleReset = () => {
        setSettings({ ...initialSettings });
        setHasChanges(false);
        setResetDialogOpen(false);
        setSnackbar({ open: true, message: 'Settings reset to defaults.', severity: 'info' });
    };

    // ─── Tabs Config ───
    const TABS = [
        { value: 'general', label: 'General', icon: <BusinessIcon sx={{ fontSize: 18 }} /> },
        { value: 'cv', label: 'CV & Templates', icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
        { value: 'pricing', label: 'Premium & Pricing', icon: <WorkspacePremiumIcon sx={{ fontSize: 18 }} /> },
        { value: 'features', label: 'Features', icon: <ExtensionIcon sx={{ fontSize: 18 }} /> },
        { value: 'security', label: 'Security', icon: <SecurityIcon sx={{ fontSize: 18 }} /> },
        { value: 'storage', label: 'Storage & Limits', icon: <StorageIcon sx={{ fontSize: 18 }} /> },
    ];

    // common text field sx
    const tfSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&.Mui-focused fieldset': { borderColor: '#667eea' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* ─── Header ─── */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="700" color="#1e293b">
                        ⚙️ System Settings
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Configure platform settings, pricing, features, and security
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {hasChanges && (
                        <Chip
                            icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                            label="Unsaved changes"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#f59e0b15',
                                color: '#f59e0b',
                                border: '1px solid #f59e0b30',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                },
                            }}
                        />
                    )}
                    <Tooltip title="Reset to defaults">
                        <IconButton
                            onClick={() => setResetDialogOpen(true)}
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' },
                            }}
                        >
                            <RestoreIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={!hasChanges}
                        onClick={handleSave}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            background: hasChanges
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : '#e2e8f0',
                            boxShadow: hasChanges ? '0 4px 15px rgba(102,126,234,0.4)' : 'none',
                            color: hasChanges ? '#ffffff' : '#94a3b8',
                            '&:hover': {
                                boxShadow: hasChanges ? '0 6px 20px rgba(102,126,234,0.5)' : 'none',
                            },
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>

            {/* ─── Tabs ─── */}
            <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 4,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        minHeight: 44,
                    },
                    '& .Mui-selected': { color: '#667eea' },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#667eea',
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                    },
                }}
            >
                {TABS.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        icon={tab.icon}
                        iconPosition="start"
                        label={tab.label}
                    />
                ))}
            </Tabs>

            {/* ═══════════════════════════════════ */}
            {/* ─── GENERAL TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'general' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SettingsSection
                        icon={<BusinessIcon />}
                        title="Platform Identity"
                        description="Basic information about your platform"
                        color="#667eea"
                    >
                        <SettingRow label="Platform Name" description="The name displayed across the platform">
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.platformName}
                                onChange={(e) => updateSetting('platformName', e.target.value)}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Tagline" description="Short description shown on landing page">
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.tagline}
                                onChange={(e) => updateSetting('tagline', e.target.value)}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Website URL" description="Public website URL" noBorder>
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.website}
                                onChange={(e) => updateSetting('website', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LanguageIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<EmailIcon />}
                        title="Contact Information"
                        description="How users can reach your support team"
                        color="#10b981"
                    >
                        <SettingRow label="Contact Email" description="Primary support email address">
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.contactEmail}
                                onChange={(e) => updateSetting('contactEmail', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Phone Number" description="Support phone number">
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.contactPhone}
                                onChange={(e) => updateSetting('contactPhone', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Address" description="Business address" noBorder>
                            <TextField
                                fullWidth
                                size="small"
                                value={settings.address}
                                onChange={(e) => updateSetting('address', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<PublicIcon />}
                        title="Localization"
                        description="Language and regional preferences"
                        color="#8b5cf6"
                    >
                        <SettingRow label="Default Language" description="Platform display language">
                            <FormControl fullWidth size="small">
                                <Select
                                    value={settings.language}
                                    onChange={(e) => updateSetting('language', e.target.value)}
                                    sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                >
                                    <MenuItem value="en">🇺🇸 English</MenuItem>
                                    <MenuItem value="fr">🇫🇷 French</MenuItem>
                                    <MenuItem value="es">🇪🇸 Spanish</MenuItem>
                                    <MenuItem value="de">🇩🇪 German</MenuItem>
                                    <MenuItem value="ar">🇸🇦 Arabic</MenuItem>
                                </Select>
                            </FormControl>
                        </SettingRow>

                        <SettingRow label="Timezone" description="Default timezone">
                            <FormControl fullWidth size="small">
                                <Select
                                    value={settings.timezone}
                                    onChange={(e) => updateSetting('timezone', e.target.value)}
                                    sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                >
                                    <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                                    <MenuItem value="EST">EST (Eastern Standard Time)</MenuItem>
                                    <MenuItem value="PST">PST (Pacific Standard Time)</MenuItem>
                                    <MenuItem value="CET">CET (Central European Time)</MenuItem>
                                    <MenuItem value="AST">AST (Arabian Standard Time)</MenuItem>
                                </Select>
                            </FormControl>
                        </SettingRow>

                        <SettingRow label="Date Format" description="How dates are displayed" noBorder>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={settings.dateFormat}
                                    onChange={(e) => updateSetting('dateFormat', e.target.value)}
                                    sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                >
                                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                </Select>
                            </FormControl>
                        </SettingRow>
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════════════════════════════ */}
            {/* ─── CV & TEMPLATES TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'cv' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SettingsSection
                        icon={<DescriptionIcon />}
                        title="CV Limits"
                        description="Control how many CVs users can create"
                        color="#667eea"
                    >
                        <SettingRow
                            label="Free CV Limit"
                            description="Maximum number of CVs a free user can create"
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">1</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#667eea">
                                        {settings.defaultFreeCVLimit} CVs
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">10</Typography>
                                </Box>
                                <Slider
                                    value={settings.defaultFreeCVLimit}
                                    onChange={(e, v) => updateSetting('defaultFreeCVLimit', v)}
                                    min={1}
                                    max={10}
                                    step={1}
                                    marks
                                    sx={{ color: '#667eea' }}
                                />
                            </Box>
                        </SettingRow>

                        <SettingRow
                            label="Max CV Pages"
                            description="Maximum pages per CV"
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">1</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#667eea">
                                        {settings.maxCVPages} pages
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">10</Typography>
                                </Box>
                                <Slider
                                    value={settings.maxCVPages}
                                    onChange={(e, v) => updateSetting('maxCVPages', v)}
                                    min={1}
                                    max={10}
                                    step={1}
                                    marks
                                    sx={{ color: '#667eea' }}
                                />
                            </Box>
                        </SettingRow>

                        <SettingRow
                            label="Auto-Save Interval"
                            description="How often the CV editor auto-saves (in seconds)"
                            noBorder
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">10s</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#667eea">
                                        {settings.autoSaveInterval}s
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">120s</Typography>
                                </Box>
                                <Slider
                                    value={settings.autoSaveInterval}
                                    onChange={(e, v) => updateSetting('autoSaveInterval', v)}
                                    min={10}
                                    max={120}
                                    step={5}
                                    sx={{ color: '#667eea' }}
                                />
                            </Box>
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<BrushIcon />}
                        title="Template & Customization"
                        description="Template defaults and customization options"
                        color="#ec4899"
                    >
                        <SettingRow label="Default Template" description="Template assigned to new CVs">
                            <FormControl fullWidth size="small">
                                <Select
                                    value={settings.defaultTemplate}
                                    onChange={(e) => updateSetting('defaultTemplate', e.target.value)}
                                    sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                >
                                    <MenuItem value="professional">💼 Professional</MenuItem>
                                    <MenuItem value="creative">🎨 Creative</MenuItem>
                                    <MenuItem value="executive">👔 Executive</MenuItem>
                                    <MenuItem value="ats-optimized">🎯 ATS-Optimized</MenuItem>
                                    <MenuItem value="simple">✨ Simple / Minimal</MenuItem>
                                </Select>
                            </FormControl>
                        </SettingRow>

                        <FeatureToggle
                            label="Custom Colors"
                            description="Allow users to customize template colors"
                            enabled={settings.allowCustomColors}
                            onChange={(e) => updateSetting('allowCustomColors', e.target.checked)}
                            icon={<PaletteIcon />}
                            color="#ec4899"
                        />

                        <FeatureToggle
                            label="Custom Fonts"
                            description="Allow users to change fonts in their CV"
                            enabled={settings.allowCustomFonts}
                            onChange={(e) => updateSetting('allowCustomFonts', e.target.checked)}
                            icon={<TextFieldsIcon />}
                            color="#8b5cf6"
                        />
                    </SettingsSection>

                    <SettingsSection
                        icon={<DownloadIcon />}
                        title="Export Formats"
                        description="Available download formats for CVs"
                        color="#06b6d4"
                    >
                        <FeatureToggle
                            label="PDF Export"
                            description="Allow downloading CV as PDF"
                            enabled={settings.availableFormats.includes('pdf')}
                            onChange={(e) => {
                                const formats = e.target.checked
                                    ? [...settings.availableFormats, 'pdf']
                                    : settings.availableFormats.filter((f) => f !== 'pdf');
                                updateSetting('availableFormats', formats);
                            }}
                            icon={<PictureAsPdfIcon />}
                            color="#ef4444"
                        />
                        <FeatureToggle
                            label="Word Export"
                            description="Allow downloading CV as DOCX"
                            enabled={settings.enableExportWord}
                            onChange={(e) => updateSetting('enableExportWord', e.target.checked)}
                            icon={<DescriptionIcon />}
                            color="#2563eb"
                        />
                        <FeatureToggle
                            label="PNG Export"
                            description="Allow downloading CV as PNG image"
                            enabled={settings.enableExportPNG}
                            onChange={(e) => updateSetting('enableExportPNG', e.target.checked)}
                            icon={<ImageIcon />}
                            color="#10b981"
                        />
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════════════════════════════ */}
            {/* ─── PREMIUM & PRICING TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'pricing' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SettingsSection
                        icon={<AttachMoneyIcon />}
                        title="Pricing"
                        description="Set subscription pricing"
                        color="#10b981"
                    >
                        <SettingRow label="Monthly Price" description="Price for monthly Premium subscription">
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={settings.premiumMonthlyPrice}
                                onChange={(e) => updateSetting('premiumMonthlyPrice', parseFloat(e.target.value) || 0)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Annual Price" description="Price for annual Premium subscription">
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={settings.premiumAnnualPrice}
                                onChange={(e) => updateSetting('premiumAnnualPrice', parseFloat(e.target.value) || 0)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={tfSx}
                            />
                        </SettingRow>

                        <SettingRow label="Currency" description="Payment currency">
                            <FormControl fullWidth size="small">
                                <Select
                                    value={settings.currency}
                                    onChange={(e) => updateSetting('currency', e.target.value)}
                                    sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                >
                                    <MenuItem value="USD">🇺🇸 USD ($)</MenuItem>
                                    <MenuItem value="EUR">🇪🇺 EUR (€)</MenuItem>
                                    <MenuItem value="GBP">🇬🇧 GBP (£)</MenuItem>
                                    <MenuItem value="SAR">🇸🇦 SAR (﷼)</MenuItem>
                                </Select>
                            </FormControl>
                        </SettingRow>

                        {/* Savings display */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#10b98108',
                                border: '1px solid #10b98120',
                            }}
                        >
                            <Typography variant="caption" fontWeight="700" color="#10b981" sx={{ mb: 1, display: 'block' }}>
                                💰 ANNUAL SAVINGS
                            </Typography>
                            <Typography variant="body2" color="#1e293b">
                                Users save{' '}
                                <strong>
                                    ${((settings.premiumMonthlyPrice * 12 - settings.premiumAnnualPrice)).toFixed(2)}
                                </strong>{' '}
                                per year ({((1 - settings.premiumAnnualPrice / (settings.premiumMonthlyPrice * 12)) * 100).toFixed(0)}% off)
                                with annual billing.
                            </Typography>
                        </Box>
                    </SettingsSection>

                    <SettingsSection
                        icon={<WorkspacePremiumIcon />}
                        title="Trial & Billing"
                        description="Free trial and billing settings"
                        color="#8b5cf6"
                    >
                        <FeatureToggle
                            label="Free Trial"
                            description="Offer a free trial for Premium features"
                            enabled={settings.enableFreeTrial}
                            onChange={(e) => updateSetting('enableFreeTrial', e.target.checked)}
                            icon={<LockOpenIcon />}
                            color="#8b5cf6"
                        />

                        {settings.enableFreeTrial && (
                            <SettingRow label="Trial Duration" description="Number of free trial days">
                                <Box sx={{ px: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="#94a3b8">3 days</Typography>
                                        <Typography variant="body2" fontWeight="700" color="#8b5cf6">
                                            {settings.trialDays} days
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">30 days</Typography>
                                    </Box>
                                    <Slider
                                        value={settings.trialDays}
                                        onChange={(e, v) => updateSetting('trialDays', v)}
                                        min={3}
                                        max={30}
                                        step={1}
                                        sx={{ color: '#8b5cf6' }}
                                    />
                                </Box>
                            </SettingRow>
                        )}

                        <FeatureToggle
                            label="Auto-Renew Subscriptions"
                            description="Automatically renew subscriptions"
                            enabled={settings.autoRenew}
                            onChange={(e) => updateSetting('autoRenew', e.target.checked)}
                            icon={<ReceiptLongIcon />}
                            color="#10b981"
                        />

                        <SettingRow label="Refund Period" description="Days allowed for refund after payment" noBorder>
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">0</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#8b5cf6">
                                        {settings.refundPeriodDays} days
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">30</Typography>
                                </Box>
                                <Slider
                                    value={settings.refundPeriodDays}
                                    onChange={(e, v) => updateSetting('refundPeriodDays', v)}
                                    min={0}
                                    max={30}
                                    step={1}
                                    sx={{ color: '#8b5cf6' }}
                                />
                            </Box>
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<CreditCardIcon />}
                        title="Payment Methods"
                        description="Accepted payment methods"
                        color="#f59e0b"
                    >
                        <FeatureToggle
                            label="Credit / Debit Card"
                            description="Accept Visa, Mastercard, AMEX"
                            enabled={settings.paymentMethods.includes('credit_card')}
                            onChange={(e) => {
                                const methods = e.target.checked
                                    ? [...settings.paymentMethods, 'credit_card']
                                    : settings.paymentMethods.filter((m) => m !== 'credit_card');
                                updateSetting('paymentMethods', methods);
                            }}
                            icon={<CreditCardIcon />}
                            color="#667eea"
                        />
                        <FeatureToggle
                            label="PayPal"
                            description="Accept PayPal payments"
                            enabled={settings.paymentMethods.includes('paypal')}
                            onChange={(e) => {
                                const methods = e.target.checked
                                    ? [...settings.paymentMethods, 'paypal']
                                    : settings.paymentMethods.filter((m) => m !== 'paypal');
                                updateSetting('paymentMethods', methods);
                            }}
                            icon={<PaymentIcon />}
                            color="#0070ba"
                        />
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════════════════════════════ */}
            {/* ─── FEATURES TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'features' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Critical */}
                    <SettingsSection
                        icon={<WarningAmberIcon />}
                        title="Critical Controls"
                        description="System-wide toggles — use with caution"
                        color="#ef4444"
                    >
                        <FeatureToggle
                            label="Maintenance Mode"
                            description="Temporarily disable the platform for all users"
                            enabled={settings.maintenanceMode}
                            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                            icon={<SpeedIcon />}
                            color="#ef4444"
                        />
                        <FeatureToggle
                            label="User Registration"
                            description="Allow new users to sign up"
                            enabled={settings.enableRegistration}
                            onChange={(e) => updateSetting('enableRegistration', e.target.checked)}
                            icon={<PersonIcon />}
                            color="#10b981"
                        />
                    </SettingsSection>

                    {/* AI & Smart Features */}
                    <SettingsSection
                        icon={<AutoAwesomeIcon />}
                        title="AI & Smart Features"
                        description="AI-powered tools and intelligent features"
                        color="#8b5cf6"
                    >
                        <FeatureToggle
                            label="AI Writing Assistant"
                            description="Help users write better CV content with AI"
                            enabled={settings.enableAIAssistant}
                            onChange={(e) => updateSetting('enableAIAssistant', e.target.checked)}
                            icon={<SmartToyIcon />}
                            color="#8b5cf6"
                        />
                        <FeatureToggle
                            label="Cover Letter Generator"
                            description="AI-powered cover letter creation"
                            enabled={settings.enableCoverLetter}
                            onChange={(e) => updateSetting('enableCoverLetter', e.target.checked)}
                            icon={<DescriptionIcon />}
                            color="#ec4899"
                        />
                        <FeatureToggle
                            label="Multi-Language CV"
                            description="Allow CVs in multiple languages"
                            enabled={settings.enableMultiLanguageCV}
                            onChange={(e) => updateSetting('enableMultiLanguageCV', e.target.checked)}
                            icon={<PublicIcon />}
                            color="#06b6d4"
                        />
                    </SettingsSection>

                    {/* Sharing & Analytics */}
                    <SettingsSection
                        icon={<ShareIcon />}
                        title="Sharing & Analytics"
                        description="Social and analytics features"
                        color="#06b6d4"
                    >
                        <FeatureToggle
                            label="CV Sharing"
                            description="Allow users to share CV via link"
                            enabled={settings.enableCVSharing}
                            onChange={(e) => updateSetting('enableCVSharing', e.target.checked)}
                            icon={<ShareIcon />}
                            color="#06b6d4"
                        />
                        <FeatureToggle
                            label="Public Profile"
                            description="Allow users to create a public portfolio page"
                            enabled={settings.enablePublicProfile}
                            onChange={(e) => updateSetting('enablePublicProfile', e.target.checked)}
                            icon={<PersonIcon />}
                            color="#667eea"
                        />
                        <FeatureToggle
                            label="Analytics Dashboard"
                            description="Show CV view and download analytics to users"
                            enabled={settings.enableAnalytics}
                            onChange={(e) => updateSetting('enableAnalytics', e.target.checked)}
                            icon={<AnalyticsIcon />}
                            color="#10b981"
                        />
                    </SettingsSection>

                    {/* Appearance */}
                    <SettingsSection
                        icon={<FormatPaintIcon />}
                        title="Appearance"
                        description="Visual customization options"
                        color="#ec4899"
                    >
                        <FeatureToggle
                            label="Template Customization"
                            description="Allow users to customize template layouts"
                            enabled={settings.enableTemplateCustomization}
                            onChange={(e) => updateSetting('enableTemplateCustomization', e.target.checked)}
                            icon={<TuneIcon />}
                            color="#ec4899"
                        />
                        <FeatureToggle
                            label="Watermark on Free CVs"
                            description="Add a small watermark to free-tier CV exports"
                            enabled={settings.enableWatermark}
                            onChange={(e) => updateSetting('enableWatermark', e.target.checked)}
                            icon={<BrushIcon />}
                            color="#94a3b8"
                        />
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════════════════════════════ */}
            {/* ─── SECURITY TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'security' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SettingsSection
                        icon={<ShieldIcon />}
                        title="Authentication"
                        description="Login and account security settings"
                        color="#ef4444"
                    >
                        <SettingRow
                            label="Max Login Attempts"
                            description="Lock account after failed attempts"
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">3</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#ef4444">
                                        {settings.maxLoginAttempts} attempts
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">10</Typography>
                                </Box>
                                <Slider
                                    value={settings.maxLoginAttempts}
                                    onChange={(e, v) => updateSetting('maxLoginAttempts', v)}
                                    min={3}
                                    max={10}
                                    step={1}
                                    marks
                                    sx={{ color: '#ef4444' }}
                                />
                            </Box>
                        </SettingRow>

                        <SettingRow
                            label="Session Timeout"
                            description="Auto-logout after inactivity (minutes)"
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">15m</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#ef4444">
                                        {settings.sessionTimeout} min
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">480m</Typography>
                                </Box>
                                <Slider
                                    value={settings.sessionTimeout}
                                    onChange={(e, v) => updateSetting('sessionTimeout', v)}
                                    min={15}
                                    max={480}
                                    step={15}
                                    sx={{ color: '#ef4444' }}
                                />
                            </Box>
                        </SettingRow>

                        <SettingRow
                            label="Min Password Length"
                            description="Minimum characters required for passwords"
                            noBorder
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">6</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#ef4444">
                                        {settings.passwordMinLength} characters
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">20</Typography>
                                </Box>
                                <Slider
                                    value={settings.passwordMinLength}
                                    onChange={(e, v) => updateSetting('passwordMinLength', v)}
                                    min={6}
                                    max={20}
                                    step={1}
                                    marks
                                    sx={{ color: '#ef4444' }}
                                />
                            </Box>
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<VpnKeyIcon />}
                        title="Verification & 2FA"
                        description="Account verification and two-factor authentication"
                        color="#f59e0b"
                    >
                        <FeatureToggle
                            label="Email Verification"
                            description="Require email verification on signup"
                            enabled={settings.requireEmailVerification}
                            onChange={(e) => updateSetting('requireEmailVerification', e.target.checked)}
                            icon={<EmailIcon />}
                            color="#f59e0b"
                        />
                        <FeatureToggle
                            label="Two-Factor Authentication"
                            description="Require 2FA for all users"
                            enabled={settings.require2FA}
                            onChange={(e) => updateSetting('require2FA', e.target.checked)}
                            icon={<SecurityIcon />}
                            color="#ef4444"
                        />
                    </SettingsSection>

                    <SettingsSection
                        icon={<GroupIcon />}
                        title="Social Login"
                        description="Third-party authentication providers"
                        color="#667eea"
                    >
                        <FeatureToggle
                            label="Social Login"
                            description="Allow login via third-party providers"
                            enabled={settings.allowSocialLogin}
                            onChange={(e) => updateSetting('allowSocialLogin', e.target.checked)}
                            icon={<PersonIcon />}
                            color="#667eea"
                        />
                        {settings.allowSocialLogin && (
                            <>
                                <FeatureToggle
                                    label="Google Login"
                                    description="Sign in with Google"
                                    enabled={settings.allowGoogleLogin}
                                    onChange={(e) => updateSetting('allowGoogleLogin', e.target.checked)}
                                    icon={<LanguageIcon />}
                                    color="#ea4335"
                                />
                                <FeatureToggle
                                    label="LinkedIn Login"
                                    description="Sign in with LinkedIn"
                                    enabled={settings.allowLinkedInLogin}
                                    onChange={(e) => updateSetting('allowLinkedInLogin', e.target.checked)}
                                    icon={<PersonIcon />}
                                    color="#0077b5"
                                />
                            </>
                        )}
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════════════════════════════ */}
            {/* ─── STORAGE & LIMITS TAB ─── */}
            {/* ═══════════════════════════════════ */}
            {activeTab === 'storage' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SettingsSection
                        icon={<CloudUploadIcon />}
                        title="File Upload"
                        description="Upload size and storage limits"
                        color="#06b6d4"
                    >
                        <SettingRow
                            label="Max File Upload Size"
                            description="Maximum size per uploaded file (MB)"
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">1 MB</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#06b6d4">
                                        {settings.maxFileUploadSize} MB
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">25 MB</Typography>
                                </Box>
                                <Slider
                                    value={settings.maxFileUploadSize}
                                    onChange={(e, v) => updateSetting('maxFileUploadSize', v)}
                                    min={1}
                                    max={25}
                                    step={1}
                                    sx={{ color: '#06b6d4' }}
                                />
                            </Box>
                        </SettingRow>

                        <SettingRow
                            label="Storage Per User"
                            description="Maximum storage allocated per user (MB)"
                            noBorder
                        >
                            <Box sx={{ px: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="#94a3b8">25 MB</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#06b6d4">
                                        {settings.maxStoragePerUser} MB
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">500 MB</Typography>
                                </Box>
                                <Slider
                                    value={settings.maxStoragePerUser}
                                    onChange={(e, v) => updateSetting('maxStoragePerUser', v)}
                                    min={25}
                                    max={500}
                                    step={25}
                                    sx={{ color: '#06b6d4' }}
                                />
                            </Box>
                        </SettingRow>
                    </SettingsSection>

                    <SettingsSection
                        icon={<BackupIcon />}
                        title="Backup"
                        description="Automatic backup settings"
                        color="#10b981"
                    >
                        <FeatureToggle
                            label="Cloud Backup"
                            description="Automatically backup user data to cloud"
                            enabled={settings.enableCloudBackup}
                            onChange={(e) => updateSetting('enableCloudBackup', e.target.checked)}
                            icon={<BackupIcon />}
                            color="#10b981"
                        />

                        {settings.enableCloudBackup && (
                            <SettingRow label="Backup Frequency" description="How often backups run" noBorder>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={settings.backupFrequency}
                                        onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                                        sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                                    >
                                        <MenuItem value="hourly">Every Hour</MenuItem>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                    </Select>
                                </FormControl>
                            </SettingRow>
                        )}
                    </SettingsSection>
                </Box>
            )}

            {/* ═══════════ RESET DIALOG ═══════════ */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon /> Reset All Settings
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b">
                        This will reset <strong>all settings</strong> to their default values. Any unsaved
                        changes will be lost.
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                        This action cannot be undone. Make sure you have exported your current settings if
                        needed.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setResetDialogOpen(false)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReset}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                        Reset to Defaults
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ SNACKBAR ═══════════ */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ─── Floating Save Bar ─── */}
            {hasChanges && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: '#1e293b',
                        color: '#ffffff',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        zIndex: 1300,
                        animation: 'slideUp 0.3s ease',
                        '@keyframes slideUp': {
                            from: { transform: 'translateX(-50%) translateY(20px)', opacity: 0 },
                            to: { transform: 'translateX(-50%) translateY(0)', opacity: 1 },
                        },
                    }}
                >
                    <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="600">
                        You have unsaved changes
                    </Typography>
                    <Button
                        size="small"
                        onClick={() => {
                            setSettings({ ...initialSettings });
                            setHasChanges(false);
                        }}
                        sx={{ textTransform: 'none', color: '#94a3b8', fontWeight: 600, '&:hover': { color: '#ffffff' } }}
                    >
                        Discard
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            bgcolor: '#667eea',
                            '&:hover': { bgcolor: '#5a6fd6' },
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            )}
        </Box>
    );
}