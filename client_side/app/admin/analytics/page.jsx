'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Alert,
  Skeleton,
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
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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

const API_BASE_URL = '/api';

async function fetchDashboardData(timeRange) {
  const response = await fetch(`${API_BASE_URL}/admin/analytics?timeRange=${timeRange}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function exportDashboardData(timeRange, format = 'csv') {
  const response = await fetch(
    `${API_BASE_URL}/admin/analytics/export?timeRange=${timeRange}&format=${format}`,
    {
      headers: {
        ...(typeof window !== 'undefined' && localStorage.getItem('token')
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

const formatCurrency = (val) => `$${val.toLocaleString()}`;
const formatNumber = (val) => val.toLocaleString();

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

const ChartCard = ({
  icon,
  title,
  description,
  children,
  color = '#667eea',
  action,
  loading = false,
}) => (
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
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', py: 4 }}>
          <CircularProgress size={32} sx={{ color }} />
          <Typography variant="caption" color="#94a3b8">
            Loading data...
          </Typography>
        </Box>
      ) : (
        children
      )}
    </Box>
  </Box>
);

const StatCard = ({
  icon,
  label,
  value,
  change,
  changeLabel,
  gradient,
  loading = false,
}) => (
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
      {!loading && change !== undefined && (
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
    {loading ? (
      <>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={16} />
      </>
    ) : (
      <>
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
      </>
    )}
  </Box>
);

function useDashboardData(timeRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData(timeRange);
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

const metricIconMap = {
  'Avg CVs / User': <DescriptionIcon sx={{ fontSize: 18 }} />,
  'Premium Rate': <WorkspacePremiumIcon sx={{ fontSize: 18 }} />,
  'Download Rate': <DownloadIcon sx={{ fontSize: 18 }} />,
  'Avg Revenue / User': <AttachMoneyIcon sx={{ fontSize: 18 }} />,
  'Letter / User': <MailOutlineIcon sx={{ fontSize: 18 }} />,
  'Monthly Growth': <TrendingUpIcon sx={{ fontSize: 18 }} />,
  'Active Rate': <PeopleIcon sx={{ fontSize: 18 }} />,
  Retention: <StarIcon sx={{ fontSize: 18 }} />,
};

const activityTypeIconMap = {
  user: '#667eea',
  cv: '#10b981',
  premium: '#f59e0b',
  letter: '#ec4899',
  download: '#3b82f6',
};

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('year');
  const [cvPeriod, setCvPeriod] = useState('weekly');
  const [exporting, setExporting] = useState(false);

  const { data, loading, error, refetch, lastUpdated } = useDashboardData(timeRange);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDashboardData(timeRange);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const userGrowthConfig = useMemo(() => {
    if (!data?.userGrowth) return null;
    return {
      data: {
        labels: data.userGrowth.labels,
        datasets: [
          {
            label: 'Total Users',
            data: data.userGrowth.totalUsers,
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
            data: data.userGrowth.premiumUsers,
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
  }, [data?.userGrowth]);

  const cvWeeklyConfig = useMemo(() => {
    if (!data?.cvWeekly) return null;
    return {
      data: {
        labels: data.cvWeekly.labels,
        datasets: [
          {
            label: 'CVs Created',
            data: data.cvWeekly.cvs,
            backgroundColor: '#10b981',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Downloads',
            data: data.cvWeekly.downloads,
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
  }, [data?.cvWeekly]);

  const cvMonthlyConfig = useMemo(() => {
    if (!data?.cvMonthly) return null;
    return {
      data: {
        labels: data.cvMonthly.labels,
        datasets: [
          {
            label: 'CVs Created',
            data: data.cvMonthly.cvs,
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
  }, [data?.cvMonthly]);

  const letterConfig = useMemo(() => {
    if (!data?.letters) return null;
    return {
      data: {
        labels: data.letters.labels,
        datasets: [
          {
            label: 'Created',
            data: data.letters.created,
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
            data: data.letters.downloaded,
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
  }, [data?.letters]);

  const revenueConfig = useMemo(() => {
    if (!data?.revenue) return null;
    return {
      data: {
        labels: data.revenue.labels,
        datasets: [
          {
            label: 'Revenue',
            data: data.revenue.revenue,
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
  }, [data?.revenue]);

  const templateConfig = useMemo(() => {
    if (!data?.templateUsage) return null;
    return {
      data: {
        labels: data.templateUsage.map((t) => t.name),
        datasets: [
          {
            data: data.templateUsage.map((t) => t.value),
            backgroundColor: data.templateUsage.map((t) => t.color),
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
  }, [data?.templateUsage]);

  const computedStats = useMemo(() => {
    if (!data) return null;

    const totalCvsWeekly = data.cvWeekly?.cvs.reduce((s, v) => s + v, 0) || 0;
    const totalDownloadsWeekly = data.cvWeekly?.downloads.reduce((s, v) => s + v, 0) || 0;
    const downloadRateWeekly = totalCvsWeekly > 0 ? Math.round((totalDownloadsWeekly / totalCvsWeekly) * 100) : 0;
    const totalLettersCreated = data.letters?.created.reduce((s, v) => s + v, 0) || 0;
    const totalLettersDownloaded = data.letters?.downloaded.reduce((s, v) => s + v, 0) || 0;
    const totalRevenue = data.revenue?.revenue.reduce((s, v) => s + v, 0) || 0;
    const revenueMonths = data.revenue?.revenue.length || 1;
    const avgRevenueMonth = Math.round(totalRevenue / revenueMonths);
    const totalCvsYear = data.cvMonthly?.cvs.reduce((s, v) => s + v, 0) || 0;
    const peakUserMonth = data.userGrowth
      ? data.userGrowth.labels[
          data.userGrowth.totalUsers.indexOf(Math.max(...data.userGrowth.totalUsers))
        ]
      : 'N/A';
    const peakUserValue = data.userGrowth ? Math.max(...data.userGrowth.totalUsers) : 0;
    const bestRevenueMonth = data.revenue
      ? data.revenue.labels[data.revenue.revenue.indexOf(Math.max(...data.revenue.revenue))]
      : 'N/A';
    const bestRevenueValue = data.revenue ? Math.max(...data.revenue.revenue) : 0;
    const templateTotal = data.templateUsage?.reduce((s, t) => s + t.value, 0) || 0;

    return {
      totalCvsWeekly,
      totalDownloadsWeekly,
      downloadRateWeekly,
      totalLettersCreated,
      totalLettersDownloaded,
      totalRevenue,
      avgRevenueMonth,
      totalCvsYear,
      peakUserMonth,
      peakUserValue,
      bestRevenueMonth,
      bestRevenueValue,
      templateTotal,
    };
  }, [data]);

  if (error && !data) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
          sx={{ borderRadius: 2, mb: 2 }}
        >
          <Typography fontWeight="600">Failed to load analytics data</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {error && data && (
        <Alert
          severity="warning"
          sx={{ borderRadius: 2, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          Failed to refresh data. Showing cached results.
        </Alert>
      )}

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#64748b">
              Platform growth, usage statistics, and revenue insights
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="#94a3b8">
                • Updated {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
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
            startIcon={exporting ? <CircularProgress size={16} /> : <FileDownloadIcon />}
            disabled={exporting || loading}
            onClick={handleExport}
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
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
          <Tooltip title="Refresh data">
            <span>
              <IconButton
                onClick={refetch}
                disabled={loading}
                sx={{
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                <RefreshIcon
                  sx={{
                    fontSize: 20,
                    color: '#64748b',
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard
          icon={<PeopleIcon />}
          label="Total Users"
          value={data ? formatNumber(data.summary.totalUsers) : '—'}
          change={data?.summary.totalUsersChange}
          changeLabel="vs last month"
          gradient="linear-gradient(135deg, #667eea, #764ba2)"
          loading={loading && !data}
        />
        <StatCard
          icon={<WorkspacePremiumIcon />}
          label="Premium Users"
          value={data ? formatNumber(data.summary.premiumUsers) : '—'}
          change={data?.summary.premiumUsersChange}
          changeLabel={data ? `${data.summary.premiumPercentage}% of total` : undefined}
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          loading={loading && !data}
        />
        <StatCard
          icon={<DescriptionIcon />}
          label="CVs Created"
          value={data ? formatNumber(data.summary.totalCvs) : '—'}
          change={data?.summary.totalCvsChange}
          changeLabel={data ? `${formatNumber(data.summary.cvsThisMonth)} this month` : undefined}
          gradient="linear-gradient(135deg, #10b981, #059669)"
          loading={loading && !data}
        />
        <StatCard
          icon={<MailOutlineIcon />}
          label="Motivation Letters"
          value={data ? formatNumber(data.summary.totalLetters) : '—'}
          change={data?.summary.totalLettersChange}
          changeLabel={data ? `${formatNumber(data.summary.lettersThisMonth)} this month` : undefined}
          gradient="linear-gradient(135deg, #ec4899, #db2777)"
          loading={loading && !data}
        />
        <StatCard
          icon={<DownloadIcon />}
          label="Downloads"
          value={data ? formatNumber(data.summary.totalDownloads) : '—'}
          change={data?.summary.totalDownloadsChange}
          changeLabel="PDF & DOCX"
          gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
          loading={loading && !data}
        />
        <StatCard
          icon={<MonetizationOnIcon />}
          label="Revenue"
          value={data ? formatCurrency(data.summary.totalRevenue) : '—'}
          change={data?.summary.totalRevenueChange}
          changeLabel="FCFA payments"
          gradient="linear-gradient(135deg, #10b981, #047857)"
          loading={loading && !data}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <ChartCard
          icon={<AutoGraphIcon />}
          title="User Growth"
          description="New user registrations over time"
          color="#667eea"
          loading={loading && !data}
        >
          {userGrowthConfig && computedStats && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#667eea' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    Total Users
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#f59e0b' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    Premium
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 250 }}>
                <Line data={userGrowthConfig.data} options={userGrowthConfig.options} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#667eea08',
                    border: '1px solid #667eea15',
                  }}
                >
                  <Typography variant="caption" color="#667eea" fontWeight="700">
                    Peak Month
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {computedStats.peakUserMonth} — {formatNumber(computedStats.peakUserValue)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#f59e0b08',
                    border: '1px solid #f59e0b15',
                  }}
                >
                  <Typography variant="caption" color="#f59e0b" fontWeight="700">
                    Conversion Rate
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {data?.summary.premiumPercentage}% Premium
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </ChartCard>

        <ChartCard
          icon={<EqualizerIcon />}
          title="CV Creation Analytics"
          description={cvPeriod === 'weekly' ? 'CVs created this week' : 'CVs created monthly'}
          color="#10b981"
          loading={loading && !data}
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
          {cvPeriod === 'weekly' && cvWeeklyConfig && computedStats ? (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 8, borderRadius: 1, bgcolor: '#10b981' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    CVs Created
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 8, borderRadius: 1, bgcolor: '#3b82f6' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    Downloads
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 250 }}>
                <Bar data={cvWeeklyConfig.data} options={cvWeeklyConfig.options} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#10b98108',
                    border: '1px solid #10b98115',
                  }}
                >
                  <Typography variant="caption" color="#10b981" fontWeight="700">
                    Total This Week
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {computedStats.totalCvsWeekly} CVs
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#3b82f608',
                    border: '1px solid #3b82f615',
                  }}
                >
                  <Typography variant="caption" color="#3b82f6" fontWeight="700">
                    Download Rate
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {computedStats.downloadRateWeekly}%
                  </Typography>
                </Box>
              </Box>
            </>
          ) : cvMonthlyConfig && computedStats ? (
            <>
              <Box sx={{ height: 280 }}>
                <Bar data={cvMonthlyConfig.data} options={cvMonthlyConfig.options} />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#10b98108',
                  border: '1px solid #10b98115',
                }}
              >
                <Typography variant="caption" color="#10b981" fontWeight="700">
                  Year Total
                </Typography>
                <Typography variant="body2" fontWeight="700" color="#1e293b">
                  {formatNumber(computedStats.totalCvsYear)} CVs Created
                </Typography>
              </Box>
            </>
          ) : null}
        </ChartCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <ChartCard
          icon={<ArticleIcon />}
          title="Motivation Letter Analytics"
          description="Letters created vs downloaded"
          color="#ec4899"
          loading={loading && !data}
        >
          {letterConfig && computedStats && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#ec4899' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    Created
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: '#8b5cf6' }} />
                  <Typography variant="caption" color="#64748b" fontWeight="600">
                    Downloaded
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 250 }}>
                <Line data={letterConfig.data} options={letterConfig.options} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#ec489908',
                    border: '1px solid #ec489915',
                  }}
                >
                  <Typography variant="caption" color="#ec4899" fontWeight="700">
                    Total Created
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {formatNumber(computedStats.totalLettersCreated)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#8b5cf608',
                    border: '1px solid #8b5cf615',
                  }}
                >
                  <Typography variant="caption" color="#8b5cf6" fontWeight="700">
                    Total Downloaded
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {formatNumber(computedStats.totalLettersDownloaded)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </ChartCard>

        <ChartCard
          icon={<AccountBalanceWalletIcon />}
          title="Revenue Analytics"
          description="Premium payments per month"
          color="#10b981"
          loading={loading && !data}
        >
          {revenueConfig && computedStats && (
            <>
              <Box sx={{ height: 250 }}>
                <Bar data={revenueConfig.data} options={revenueConfig.options} />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 1.5,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#10b98108',
                    border: '1px solid #10b98115',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="#10b981" fontWeight="700">
                    Total Revenue
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#1e293b">
                    {formatCurrency(computedStats.totalRevenue)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#667eea08',
                    border: '1px solid #667eea15',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="#667eea" fontWeight="700">
                    Avg / Month
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#1e293b">
                    {formatCurrency(computedStats.avgRevenueMonth)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#f59e0b08',
                    border: '1px solid #f59e0b15',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="#f59e0b" fontWeight="700">
                    Best Month
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#1e293b">
                    {computedStats.bestRevenueMonth} — {formatCurrency(computedStats.bestRevenueValue)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mb: 3,
        }}
      >
        <ChartCard
          icon={<DonutLargeIcon />}
          title="Template Usage"
          description="Most popular templates"
          color="#8b5cf6"
          loading={loading && !data}
        >
          {templateConfig && data?.templateUsage && computedStats && (
            <>
              <Box
                sx={{
                  height: 220,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
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
                      {computedStats.templateTotal}%
                    </Typography>
                    <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>
                      Total
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                {data.templateUsage.map((t) => (
                  <Box
                    key={t.name}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: t.color,
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="#64748b"
                      fontWeight="600"
                      sx={{ fontSize: '0.65rem' }}
                    >
                      {t.name} {t.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </ChartCard>

        <ChartCard
          icon={<BrushIcon />}
          title="Top Templates"
          description="Usage ranking with growth"
          color="#ec4899"
          loading={loading && !data}
        >
          {data?.topTemplates && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.topTemplates.map((t, i) => (
                <Box key={t.name}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
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
                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                        {t.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="700" color="#64748b">
                        {formatNumber(t.uses)}
                      </Typography>
                      <Chip
                        icon={
                          t.growth >= 0 ? (
                            <ArrowUpwardIcon sx={{ fontSize: 10 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 10 }} />
                          )
                        }
                        label={`${t.growth >= 0 ? '+' : ''}${t.growth}%`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.55rem',
                          height: 18,
                          bgcolor: t.growth >= 0 ? '#10b98112' : '#ef444412',
                          color: t.growth >= 0 ? '#10b981' : '#ef4444',
                          '& .MuiChip-icon': {
                            color: t.growth >= 0 ? '#10b981' : '#ef4444',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      data.topTemplates.length > 0
                        ? (t.uses / data.topTemplates[0].uses) * 100
                        : 0
                    }
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        bgcolor: t.color,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </ChartCard>

        <ChartCard
          icon={<TimelineIcon />}
          title="Recent Activity"
          description="Latest platform events"
          color="#06b6d4"
          loading={loading && !data}
        >
          {data?.recentActivity && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {data.recentActivity.map((activity, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    borderBottom:
                      i < data.recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activity.color || activityTypeIconMap[activity.type] || '#94a3b8',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      color="#1e293b"
                      fontWeight="500"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.7rem',
                      }}
                    >
                      {activity.text}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="#94a3b8"
                    sx={{ fontSize: '0.6rem', flexShrink: 0 }}
                  >
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        {loading && !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            ))
          : data?.todayStats && (
              <>
                {[
                  {
                    icon: <GroupAddIcon sx={{ fontSize: 20 }} />,
                    label: 'New Users Today',
                    value: String(data.todayStats.newUsers),
                    sub: data.todayStats.newUsersDiff,
                    color: '#667eea',
                    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
                  },
                  {
                    icon: <NoteAddIcon sx={{ fontSize: 20 }} />,
                    label: 'CVs Created Today',
                    value: String(data.todayStats.cvsCreated),
                    sub: `${data.todayStats.cvsDownloaded} downloads`,
                    color: '#10b981',
                    gradient: 'linear-gradient(135deg, #10b981, #059669)',
                  },
                  {
                    icon: <TextSnippetIcon sx={{ fontSize: 20 }} />,
                    label: 'Letters Today',
                    value: String(data.todayStats.lettersCreated),
                    sub: `${data.todayStats.lettersDownloaded} downloaded`,
                    color: '#ec4899',
                    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
                  },
                  {
                    icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />,
                    label: 'Revenue Today',
                    value: formatCurrency(data.todayStats.revenueToday),
                    sub: `${data.todayStats.newPremiums} new premiums`,
                    color: '#f59e0b',
                    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  },
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
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${item.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {item.icon}
                      <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.9 }}>
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="800">
                      {item.value}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                      {item.sub}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <ChartCard
          icon={<InsightsIcon />}
          title="Conversion Funnel"
          description="User journey from signup to premium"
          color="#667eea"
          loading={loading && !data}
        >
          {data?.conversionFunnel && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.conversionFunnel.map((step, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: step.color,
                        }}
                      />
                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                        {step.label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="700" color="#64748b">
                        {formatNumber(step.value)}
                      </Typography>
                      <Typography variant="caption" fontWeight="600" color={step.color}>
                        {step.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={step.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: step.color,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </ChartCard>

        <ChartCard
          icon={<BarChartIcon />}
          title="Key Performance Metrics"
          description="Important platform KPIs"
          color="#8b5cf6"
          loading={loading && !data}
        >
          {data?.keyMetrics && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {data.keyMetrics.map((metric, i) => (
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
                  <Box sx={{ color: metric.color }}>
                    {metricIconMap[metric.label] || <BarChartIcon sx={{ fontSize: 18 }} />}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="800" color="#1e293b">
                      {metric.value}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>
                      {metric.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </ChartCard>
      </Box>
    </Box>
  );
}