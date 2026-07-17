// app/(dashboard)/analytics/page.jsx
'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Target,
  Activity,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const upcomingFeatures = [
  {
    icon: Eye,
    title: 'CV View Tracking',
    desc: 'See how many times each CV and motivation letter is viewed.',
    color: '#000000',
  },
  {
    icon: TrendingUp,
    title: 'Download Trends',
    desc: 'Visualize download activity over time with clear charts.',
    color: '#10b981',
  },
  {
    icon: Target,
    title: 'ATS Score Insights',
    desc: 'Compare your CV\'s keywords against a job description you provide for genuine ATS compatibility scoring.',
    color: '#f59e0b',
  },
  {
    icon: Activity,
    title: 'Engagement Reports',
    desc: 'Understand which templates and sections perform best.',
    color: '#ef4444',
  },
];

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: 'auto',
        animation: 'fadeIn 0.5s ease',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.push('/dashboard')}
          sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', mb: 2, '&:hover': { bgcolor: '#f1f5f9' } }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="700" color="#1e293b" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          CV Analytics
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Insights and performance tracking for your documents
        </Typography>
      </Box>

      {/* Hero Card */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          color: '#ffffff',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            animation: 'floatIcon 3s ease-in-out infinite',
            '@keyframes floatIcon': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          <BarChart3 size={40} />
        </Box>
        <Chip
          icon={<Sparkles size={14} color="#000000" />}
          label="Coming Soon"
          sx={{
            bgcolor: '#ffffff',
            color: '#000000',
            fontWeight: 700,
            mb: 2,
            '& .MuiChip-icon': { color: '#000000' },
          }}
        />
        <Typography variant="h5" fontWeight="700" gutterBottom>
          Powerful Analytics Are on the Way
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 520, mx: 'auto' }}>
          We're building a dedicated analytics dashboard so you can track views, downloads,
          and ATS performance for every CV and motivation letter you create.
        </Typography>
      </Box>

      {/* Feature Preview Grid */}
      <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
        What's coming
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {upcomingFeatures.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <Box
              key={index}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.5s ease ${index * 0.08}s both`,
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translateY(15px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FeatureIcon size={22} color={feature.color} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="700" color="#1e293b">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  {feature.desc}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
