import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React from 'react'

export default function ModalComponent({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 4,
          p: 4,
          maxWidth: 550,
          width: '90%',
          position: 'relative',
          outline: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: '#94a3b8' }}
        >
          ✕
        </IconButton>

        {/* Header */}
        <Typography variant="h5" fontWeight="800" gutterBottom>
          ⭐ Upgrade to Premium
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
          Unlock the full power of CVtify and land your dream job faster.
        </Typography>

        {/* Advantages List */}
        {[
          { icon: '📊', title: 'Advanced Analytics', desc: 'Track CV views, download rates & ATS scores' },
          { icon: '🎯', title: 'Profile Strength Score', desc: 'Get a detailed breakdown of your CV quality' },
          { icon: '🎨', title: 'Premium Templates', desc: 'Access 50+ professionally designed templates' },
          { icon: '📄', title: 'Unlimited CVs', desc: 'Create up to 100 CVs instead of 10' },
          { icon: '🤖', title: 'AI Suggestions', desc: 'Get smart tips to improve your CV content' },
          { icon: '📥', title: 'Priority Support', desc: 'Get help within 24 hours from our team' },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: '#667eea15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="700" color="#1e293b">
                {item.title}
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                {item.desc}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Bottom Section with Price + Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 3,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="800" color="#1e293b">
              $9.99
              <Typography component="span" variant="body2" color="#94a3b8">
                {' '}/month
              </Typography>
            </Typography>
            <Typography variant="caption" color="#10b981" fontWeight="600">
              Cancel anytime
            </Typography>
          </Box>

          {/* "Get Full Access Now" Button - RIGHT CORNER */}
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '0.95rem',
              '&:hover': {
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.5)',
              },
            }}
          >
            🚀 Get Full Access Now
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
