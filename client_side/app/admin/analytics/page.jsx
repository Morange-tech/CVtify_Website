'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Select,
    FormControl,
    MenuItem,
    Button,
    LinearProgress,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DescriptionIcon from '@mui/icons-material/Description';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DownloadIcon from '@mui/icons-material/Download';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import BrushIcon from '@mui/icons-material/Brush';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// ─── Register Chart.js ───
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

// ─── Chart Data ───
const USER_GROWTH_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    totalUsers: [120, 185, 260, 340, 445, 580, 720, 890, 1050, 1240, 1420, 1650],
    premiumUsers: [15, 28, 42, 58, 78, 105, 138, 175, 210, 255, 298, 350],
};

const CV_WEEKLY_DATA = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cvs: [45, 62, 38, 55, 72, 28, 18],
    downloads: [32, 48, 28, 41, 58, 20, 12],
};

const CV_MONTHLY_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    cvs: [340, 420, 510, 480, 620, 750, 680, 820, 910, 1050, 1180, 1350],
};

const LETTER_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    created: [85, 120, 145, 130, 175, 210, 195, 240, 280, 310, 350, 400],
    downloaded: [62, 95, 110, 98, 140, 168, 155, 192, 225, 248, 282, 320],
};

const REVENUE_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [750, 1400, 2100, 2900, 3900, 5250, 6900, 8750, 10500, 12750, 14900, 17500],
};

const TEMPLATE_USAGE = [
    { name: 'Modern', value: 35, color: '#667eea' },
    { name: 'Professional', value: 28, color: '#10b981' },
    { name: 'Creative', value: 18, color: '#ec4899' },
    { name: 'Simple', value: 12, color: '#f59e0b' },
    { name: 'Executive', value: 5, color: '#8b5cf6' },
    { name: 'Academic', value: 2, color: '#06b6d4' },
];

const RECENT_ACTIVITY = [
    { type: 'user', text: 'Sarah Johnson registered', time: '2m ago', color: '#667eea' },
    { type: 'cv', text: 'Michael Chen created a CV', time: '5m ago', color: '#10b981' },
    { type: 'premium', text: 'Emily Davis upgraded to Premium', time: '12m ago', color: '#f59e0b' },
    { type: 'letter', text: 'James Wilson created a letter', time: '18m ago', color: '#ec4899' },
    { type: 'download', text: 'Lisa Anderson downloaded CV', time: '25m ago', color: '#3b82f6' },
    { type: 'user', text: 'Tom Harris registered', time: '32m ago', color: '#667eea' },
    { type: 'cv', text: 'David Brown created a CV', time: '45m ago', color: '#10b981' },
    { type: 'premium', text: 'Rachel Green upgraded to Premium', time: '1h ago', color: '#f59e0b' },
];

const TOP_TEMPLATES = [
    { name: 'Modern', uses: 2450, growth: 12, color: '#667eea' },
    { name: 'Professional', uses: 1960, growth: 8, color: '#10b981' },
    { name: 'Creative', uses: 1260, growth: 15, color: '#ec4899' },
    { name: 'Simple', uses: 840, growth: -3, color: '#f59e0b' },
    { name: 'Executive', uses: 350, growth: 22, color: '#8b5cf6' },
];

// ─── Helpers ───
const formatCurrency = (val) => `$${val.toLocaleString()}`;
const formatNumber = (val) => val.toLocaleString();

// ─── Common Chart Options ───
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, weight: '600' },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 4,
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11, weight: '500' } },
            border: { display: false },
        },
        y: {
            grid: { color: '#f1f5f9', drawBorder: false },
            ticks: { color: '#94a3b8', font: { size: 11 }, padding: 8 },
            border: { display: false },
        },
    },
    interaction: {
        intersect: false,
        mode: 'index',
    },
};

// ─── Chart Card Wrapper ───
const ChartCard = ({ icon, title, description, children, color = '#667eea', action }) => (
    <Box
        sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Box
            sx={{
                p: 2.5,
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color,
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
            {action}
        </Box>
        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {children}
        </Box>
    </Box>
);

// ─── Stat Card ───
const StatCard = ({ icon, label, value, change, changeLabel, gradient }) => (
    <Box
        sx={{
            bgcolor: '#ffffff',
            p: 2.5,
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' },
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: gradient,
                opacity: 0.08,
            }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    '& .MuiSvgIcon-root': { fontSize: 22 },
                }}
            >
                {icon}
            </Box>
            {change !== undefined && (
                <Chip
                    icon={
                        change >= 0 ? (
                            <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                        ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 12 }} />
                        )
                    }
                    label={`${change >= 0 ? '+' : ''}${change}%`}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 22,
                        bgcolor: change >= 0 ? '#10b98112' : '#ef444412',
                        color: change >= 0 ? '#10b981' : '#ef4444',
                        '& .MuiChip-icon': { color: change >= 0 ? '#10b981' : '#ef4444' },
                    }}
                />
            )}
        </Box>
        <Typography variant="h5" fontWeight="800" color="#1e293b" sx={{ lineHeight: 1.2, mb: 0.3 }}>
            {value}
        </Typography>
        <Typography variant="caption" color="#94a3b8">
            {label}
        </Typography>
        {changeLabel && (
            <Typography variant="caption" color="#cbd5e1" sx={{ display: 'block', mt: 0.3 }}>
                {changeLabel}
            </Typography>
        )}
    </Box>
);

export default function AnalyticsDashboardPage() {
    const [timeRange, setTimeRange] = useState('year');
    const [cvPeriod, setCvPeriod] = useState('weekly');

    // ─── Chart Configs ───

    // 📈 User Growth (Line)
    const userGrowthConfig = {
        data: {
            labels: USER_GROWTH_DATA.labels,
            datasets: [
                {
                    label: 'Total Users',
                    data: USER_GROWTH_DATA.totalUsers,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#667eea',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#667eea',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Premium Users',
                    data: USER_GROWTH_DATA.premiumUsers,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#f59e0b',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#f59e0b',
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} users`,
                    },
                },
            },
        },
    };

    // 📊 CV Weekly (Bar)
    const cvWeeklyConfig = {
        data: {
            labels: CV_WEEKLY_DATA.labels,
            datasets: [
                {
                    label: 'CVs Created',
                    data: CV_WEEKLY_DATA.cvs,
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7,
                },
                {
                    label: 'Downloads',
                    data: CV_WEEKLY_DATA.downloads,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7,
                },
            ],
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
                    },
                },
            },
        },
    };

    // 📊 CV Monthly (Bar)
    const cvMonthlyConfig = {
        data: {
            labels: CV_MONTHLY_DATA.labels,
            datasets: [
                {
                    label: 'CVs Created',
                    data: CV_MONTHLY_DATA.cvs,
                    backgroundColor: (ctx) => {
                        const gradient = ctx.chart?.ctx?.createLinearGradient(0, 0, 0, 300);
                        if (gradient) {
                            gradient.addColorStop(0, '#10b981');
                            gradient.addColorStop(1, '#059669');
                        }
                        return gradient || '#10b981';
                    },
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                },
            ],
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `CVs: ${formatNumber(ctx.parsed.y)}`,
                    },
                },
            },
        },
    };

    // 📝 Letter Analytics (Line)
    const letterConfig = {
        data: {
            labels: LETTER_DATA.labels,
            datasets: [
                {
                    label: 'Created',
                    data: LETTER_DATA.created,
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#ec4899',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ec4899',
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Downloaded',
                    data: LETTER_DATA.downloaded,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#8b5cf6',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#8b5cf6',
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} letters`,
                    },
                },
            },
        },
    };

    // 💰 Revenue (Bar)
    const revenueConfig = {
        data: {
            labels: REVENUE_DATA.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: REVENUE_DATA.revenue,
                    backgroundColor: (ctx) => {
                        const gradient = ctx.chart?.ctx?.createLinearGradient(0, 0, 0, 300);
                        if (gradient) {
                            gradient.addColorStop(0, '#10b981');
                            gradient.addColorStop(1, '#047857');
                        }
                        return gradient || '#10b981';
                    },
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                },
            ],
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `Revenue: ${formatCurrency(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        ...commonOptions.scales.y.ticks,
                        callback: (val) => `$${(val / 1000).toFixed(0)}k`,
                    },
                },
            },
        },
    };

    // 🎨 Template Usage (Doughnut)
    const templateConfig = {
        data: {
            labels: TEMPLATE_USAGE.map((t) => t.name),
            datasets: [
                {
                    data: TEMPLATE_USAGE.map((t) => t.value),
                    backgroundColor: TEMPLATE_USAGE.map((t) => t.color),
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverBorderWidth: 0,
                    hoverOffset: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 12, weight: '600' },
                    bodyFont: { size: 11 },
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
                            const pct = Math.round((ctx.parsed / total) * 100);
                            return `${ctx.label}: ${pct}%`;
                        },
                    },
                },
            },
        },
    };

    // Computed stats
    const totalCvsWeekly = CV_WEEKLY_DATA.cvs.reduce((s, v) => s + v, 0);
    const totalDownloadsWeekly = CV_WEEKLY_DATA.downloads.reduce((s, v) => s + v, 0);
    const downloadRateWeekly = Math.round((totalDownloadsWeekly / totalCvsWeekly) * 100);
    const totalLettersCreated = LETTER_DATA.created.reduce((s, v) => s + v, 0);
    const totalLettersDownloaded = LETTER_DATA.downloaded.reduce((s, v) => s + v, 0);
    const totalRevenue = REVENUE_DATA.revenue.reduce((s, v) => s + v, 0);
    const avgRevenueMonth = Math.round(totalRevenue / 12);
    const totalCvsYear = CV_MONTHLY_DATA.cvs.reduce((s, v) => s + v, 0);

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
                        📊 Analytics Dashboard
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Platform growth, usage statistics, and revenue insights
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: '#ffffff',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                            }}
                        >
                            <MenuItem value="week">This Week</MenuItem>
                            <MenuItem value="month">This Month</MenuItem>
                            <MenuItem value="quarter">This Quarter</MenuItem>
                            <MenuItem value="year">This Year</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': { borderColor: '#667eea', color: '#667eea', bgcolor: '#667eea08' },
                        }}
                    >
                        Export
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton
                            sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}
                        >
                            <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ═══════════ STAT CARDS ═══════════ */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <StatCard icon={<PeopleIcon />} label="Total Users" value={formatNumber(1650)} change={16} changeLabel="vs last month" gradient="linear-gradient(135deg, #667eea, #764ba2)" />
                <StatCard icon={<WorkspacePremiumIcon />} label="Premium Users" value={formatNumber(350)} change={18} changeLabel="21% of total" gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
                <StatCard icon={<DescriptionIcon />} label="CVs Created" value={formatNumber(9110)} change={14} changeLabel="1,350 this month" gradient="linear-gradient(135deg, #10b981, #059669)" />
                <StatCard icon={<MailOutlineIcon />} label="Motivation Letters" value={formatNumber(2640)} change={21} changeLabel="400 this month" gradient="linear-gradient(135deg, #ec4899, #db2777)" />
                <StatCard icon={<DownloadIcon />} label="Downloads" value={formatNumber(7850)} change={12} changeLabel="PDF & DOCX" gradient="linear-gradient(135deg, #3b82f6, #2563eb)" />
                <StatCard icon={<MonetizationOnIcon />} label="Revenue" value={formatCurrency(17500)} change={25} changeLabel="FCFA payments" gradient="linear-gradient(135deg, #10b981, #047857)" />
            </Box>

            {/* ═══════════ ROW 1: User Growth + CV Creation ═══════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                {/* 📈 User Growth */}
                <ChartCard icon={<AutoGraphIcon />} title="User Growth" description="New user registrations over time" color="#667eea">
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#667eea' }} />
                            <Typography variant="caption" color="#64748b" fontWeight="600">Total Users</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#f59e0b' }} />
                            <Typography variant="caption" color="#64748b" fontWeight="600">Premium</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        <Line data={userGrowthConfig.data} options={userGrowthConfig.options} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#667eea08', border: '1px solid #667eea15' }}>
                            <Typography variant="caption" color="#667eea" fontWeight="700">Peak Month</Typography>
                            <Typography variant="body2" fontWeight="700" color="#1e293b">December — 1,650</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#f59e0b08', border: '1px solid #f59e0b15' }}>
                            <Typography variant="caption" color="#f59e0b" fontWeight="700">Conversion Rate</Typography>
                            <Typography variant="body2" fontWeight="700" color="#1e293b">21.2% Premium</Typography>
                        </Box>
                    </Box>
                </ChartCard>

                {/* 📊 CV Creation */}
                <ChartCard
                    icon={<EqualizerIcon />}
                    title="CV Creation Analytics"
                    description={cvPeriod === 'weekly' ? 'CVs created this week' : 'CVs created monthly'}
                    color="#10b981"
                    action={
                        <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: 1.5, p: 0.3 }}>
                            {['weekly', 'monthly'].map((p) => (
                                <Button
                                    key={p}
                                    size="small"
                                    onClick={() => setCvPeriod(p)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        px: 1.5,
                                        py: 0.3,
                                        borderRadius: 1.5,
                                        bgcolor: cvPeriod === p ? '#ffffff' : 'transparent',
                                        color: cvPeriod === p ? '#1e293b' : '#94a3b8',
                                        boxShadow: cvPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        '&:hover': { bgcolor: cvPeriod === p ? '#ffffff' : '#e2e8f0' },
                                    }}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </Button>
                            ))}
                        </Box>
                    }
                >
                    {cvPeriod === 'weekly' ? (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 12, height: 8, borderRadius: 1, bgcolor: '#10b981' }} />
                                    <Typography variant="caption" color="#64748b" fontWeight="600">CVs Created</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 12, height: 8, borderRadius: 1, bgcolor: '#3b82f6' }} />
                                    <Typography variant="caption" color="#64748b" fontWeight="600">Downloads</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ height: 250 }}>
                                <Bar data={cvWeeklyConfig.data} options={cvWeeklyConfig.options} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#10b98108', border: '1px solid #10b98115' }}>
                                    <Typography variant="caption" color="#10b981" fontWeight="700">Total This Week</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#1e293b">{totalCvsWeekly} CVs</Typography>
                                </Box>
                                <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#3b82f608', border: '1px solid #3b82f615' }}>
                                    <Typography variant="caption" color="#3b82f6" fontWeight="700">Download Rate</Typography>
                                    <Typography variant="body2" fontWeight="700" color="#1e293b">{downloadRateWeekly}%</Typography>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ height: 280 }}>
                                <Bar data={cvMonthlyConfig.data} options={cvMonthlyConfig.options} />
                            </Box>
                            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#10b98108', border: '1px solid #10b98115' }}>
                                <Typography variant="caption" color="#10b981" fontWeight="700">Year Total</Typography>
                                <Typography variant="body2" fontWeight="700" color="#1e293b">{formatNumber(totalCvsYear)} CVs Created</Typography>
                            </Box>
                        </>
                    )}
                </ChartCard>
            </Box>

            {/* ═══════════ ROW 2: Letters + Revenue ═══════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                {/* 📝 Motivation Letter Analytics */}
                <ChartCard icon={<ArticleIcon />} title="Motivation Letter Analytics" description="Letters created vs downloaded" color="#ec4899">
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#ec4899' }} />
                            <Typography variant="caption" color="#64748b" fontWeight="600">Created</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#8b5cf6' }} />
                            <Typography variant="caption" color="#64748b" fontWeight="600">Downloaded</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        <Line data={letterConfig.data} options={letterConfig.options} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#ec489908', border: '1px solid #ec489915' }}>
                            <Typography variant="caption" color="#ec4899" fontWeight="700">Total Created</Typography>
                            <Typography variant="body2" fontWeight="700" color="#1e293b">{formatNumber(totalLettersCreated)}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: '#8b5cf608', border: '1px solid #8b5cf615' }}>
                            <Typography variant="caption" color="#8b5cf6" fontWeight="700">Total Downloaded</Typography>
                            <Typography variant="body2" fontWeight="700" color="#1e293b">{formatNumber(totalLettersDownloaded)}</Typography>
                        </Box>
                    </Box>
                </ChartCard>

                {/* 💰 Revenue Analytics */}
                <ChartCard icon={<AccountBalanceWalletIcon />} title="Revenue Analytics" description="Premium payments per month" color="#10b981">
                    <Box sx={{ height: 250 }}>
                        <Bar data={revenueConfig.data} options={revenueConfig.options} />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mt: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#10b98108', border: '1px solid #10b98115', textAlign: 'center' }}>
                            <Typography variant="caption" color="#10b981" fontWeight="700">Total Revenue</Typography>
                            <Typography variant="body2" fontWeight="800" color="#1e293b">{formatCurrency(totalRevenue)}</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#667eea08', border: '1px solid #667eea15', textAlign: 'center' }}>
                            <Typography variant="caption" color="#667eea" fontWeight="700">Avg / Month</Typography>
                            <Typography variant="body2" fontWeight="800" color="#1e293b">{formatCurrency(avgRevenueMonth)}</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f59e0b08', border: '1px solid #f59e0b15', textAlign: 'center' }}>
                            <Typography variant="caption" color="#f59e0b" fontWeight="700">Best Month</Typography>
                            <Typography variant="body2" fontWeight="800" color="#1e293b">Dec — {formatCurrency(17500)}</Typography>
                        </Box>
                    </Box>
                </ChartCard>
            </Box>

            {/* ═══════════ ROW 3: Template Usage + Top Templates + Activity ═══════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
                {/* 🎨 Template Usage (Doughnut) */}
                <ChartCard icon={<DonutLargeIcon />} title="Template Usage" description="Most popular templates" color="#8b5cf6">
                    <Box sx={{ height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: 200, height: 200, position: 'relative' }}>
                            <Doughnut data={templateConfig.data} options={templateConfig.options} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h6" fontWeight="800" color="#1e293b">
                                    {TEMPLATE_USAGE.reduce((s, t) => s + t.value, 0)}%
                                </Typography>
                                <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>
                                    Total
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* Legend */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 1 }}>
                        {TEMPLATE_USAGE.map((t) => (
                            <Box key={t.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.color }} />
                                <Typography variant="caption" color="#64748b" fontWeight="600" sx={{ fontSize: '0.65rem' }}>
                                    {t.name} {t.value}%
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </ChartCard>

                {/* 🏆 Top Templates */}
                <ChartCard icon={<BrushIcon />} title="Top Templates" description="Usage ranking with growth" color="#ec4899">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {TOP_TEMPLATES.map((t, i) => (
                            <Box key={t.name}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 1.5,
                                                bgcolor: `${t.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: t.color,
                                                fontWeight: 800,
                                                fontSize: '0.65rem',
                                            }}
                                        >
                                            {i + 1}
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{t.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight="700" color="#64748b">{formatNumber(t.uses)}</Typography>
                                        <Chip
                                            icon={t.growth >= 0 ? <ArrowUpwardIcon sx={{ fontSize: 10 }} /> : <ArrowDownwardIcon sx={{ fontSize: 10 }} />}
                                            label={`${t.growth >= 0 ? '+' : ''}${t.growth}%`}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.55rem',
                                                height: 18,
                                                bgcolor: t.growth >= 0 ? '#10b98112' : '#ef444412',
                                                color: t.growth >= 0 ? '#10b981' : '#ef4444',
                                                '& .MuiChip-icon': { color: t.growth >= 0 ? '#10b981' : '#ef4444' },
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(t.uses / TOP_TEMPLATES[0].uses) * 100}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: '#f1f5f9',
                                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: t.color },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </ChartCard>

                {/* 🕐 Recent Activity */}
                <ChartCard icon={<TimelineIcon />} title="Recent Activity" description="Latest platform events" color="#06b6d4">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {RECENT_ACTIVITY.map((activity, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    py: 1,
                                    borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #f1f5f9' : 'none',
                                }}
                            >
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: activity.color, flexShrink: 0 }} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        color="#1e293b"
                                        fontWeight="500"
                                        sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.7rem' }}
                                    >
                                        {activity.text}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem', flexShrink: 0 }}>
                                    {activity.time}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </ChartCard>
            </Box>

            {/* ═══════════ ROW 4: Quick Insights ═══════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                {[
                    { icon: <GroupAddIcon sx={{ fontSize: 20 }} />, label: 'New Users Today', value: '23', sub: '+5 vs yesterday', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
                    { icon: <NoteAddIcon sx={{ fontSize: 20 }} />, label: 'CVs Created Today', value: '47', sub: '32 downloads', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
                    { icon: <TextSnippetIcon sx={{ fontSize: 20 }} />, label: 'Letters Today', value: '18', sub: '14 downloaded', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
                    { icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />, label: 'Revenue Today', value: '$125', sub: '3 new premiums', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
                ].map((item, i) => (
                    <Box
                        key={i}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            background: item.gradient,
                            color: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${item.color}40` },
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {item.icon}
                            <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.9 }}>{item.label}</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight="800">{item.value}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.75 }}>{item.sub}</Typography>
                    </Box>
                ))}
            </Box>

            {/* ═══════════ ROW 5: Conversion Funnel + Key Metrics ═══════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Conversion Funnel */}
                <ChartCard icon={<InsightsIcon />} title="Conversion Funnel" description="User journey from signup to premium" color="#667eea">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                            { label: 'Visitors', value: 12500, percentage: 100, color: '#94a3b8' },
                            { label: 'Registered Users', value: 1650, percentage: 13.2, color: '#667eea' },
                            { label: 'Created CV', value: 1240, percentage: 75.2, color: '#10b981' },
                            { label: 'Downloaded CV', value: 890, percentage: 71.8, color: '#3b82f6' },
                            { label: 'Upgraded to Premium', value: 350, percentage: 39.3, color: '#f59e0b' },
                        ].map((step, i) => (
                            <Box key={i}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: step.color }} />
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{step.label}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight="700" color="#64748b">{formatNumber(step.value)}</Typography>
                                        <Typography variant="caption" fontWeight="600" color={step.color}>{step.percentage}%</Typography>
                                    </Box>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={step.percentage}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#f1f5f9',
                                        '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: step.color },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </ChartCard>

                {/* Key Metrics */}
                <ChartCard icon={<BarChartIcon />} title="Key Performance Metrics" description="Important platform KPIs" color="#8b5cf6">
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        {[
                            { label: 'Avg CVs / User', value: '5.5', icon: <DescriptionIcon sx={{ fontSize: 18 }} />, color: '#10b981' },
                            { label: 'Premium Rate', value: '21.2%', icon: <WorkspacePremiumIcon sx={{ fontSize: 18 }} />, color: '#f59e0b' },
                            { label: 'Download Rate', value: '73%', icon: <DownloadIcon sx={{ fontSize: 18 }} />, color: '#3b82f6' },
                            { label: 'Avg Revenue / User', value: '$50', icon: <AttachMoneyIcon sx={{ fontSize: 18 }} />, color: '#10b981' },
                            { label: 'Letter / User', value: '1.6', icon: <MailOutlineIcon sx={{ fontSize: 18 }} />, color: '#ec4899' },
                            { label: 'Monthly Growth', value: '+16%', icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, color: '#667eea' },
                            { label: 'Active Rate', value: '68%', icon: <PeopleIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6' },
                            { label: 'Retention', value: '82%', icon: <StarIcon sx={{ fontSize: 18 }} />, color: '#f59e0b' },
                        ].map((metric, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: `${metric.color}06`,
                                    border: `1px solid ${metric.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: `${metric.color}10` },
                                }}
                            >
                                <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="800" color="#1e293b">{metric.value}</Typography>
                                    <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>{metric.label}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </ChartCard>
            </Box>
        </Box>
    );
}