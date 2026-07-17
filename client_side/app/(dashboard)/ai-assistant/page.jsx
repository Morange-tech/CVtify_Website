// app/(dashboard)/ai-assistant/page.jsx
'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import {
  Bot,
  Wand2,
  MessageSquare,
  FileEdit,
  Lightbulb,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const upcomingFeatures = [
  {
    icon: Wand2,
    title: 'Smart Content Suggestions',
    desc: 'Get AI-generated bullet points tailored to your role and experience.',
    color: '#000000',
  },
  {
    icon: FileEdit,
    title: 'Resume Optimization',
    desc: 'Receive instant feedback to strengthen wording and structure.',
    color: '#10b981',
  },
  {
    icon: MessageSquare,
    title: 'Cover Letter Assistant',
    desc: 'Generate personalized motivation letters in seconds.',
    color: '#f59e0b',
  },
  {
    icon: Lightbulb,
    title: 'Real-Time Writing Tips',
    desc: 'Get helpful suggestions as you build your documents.',
    color: '#ef4444',
  },
];

export default function AIAssistantPage() {
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
          AI Assistant
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Your personal AI-powered writing companion
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
          <Bot size={40} />
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
          Your AI Career Assistant Is Almost Here
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 520, mx: 'auto' }}>
          Soon you'll be able to generate content, polish your wording, and get smart
          suggestions for your CVs and motivation letters — powered by AI.
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
