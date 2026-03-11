'use client';

import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function SuccessModal({ 
    open, 
    title, 
    message, 
    loading = false,
    loadingText = 'Please wait...'
}) {
    return (
        <Dialog 
            open={open} 
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 2,
                    minWidth: 300,
                    textAlign: 'center'
                }
            }}
        >
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {loading ? (
                        <>
                            <CircularProgress size={60} sx={{ color: '#667eea' }} />
                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                {loadingText}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon sx={{ fontSize: 60, color: '#22c55e' }} />
                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                {title}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                {message}
                            </Typography>
                        </>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}