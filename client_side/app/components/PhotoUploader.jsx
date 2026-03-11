"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Modal,
    Paper,
    Slider,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    LinearProgress,
    styled,
    keyframes
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImageIcon from '@mui/icons-material/Image';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

// Constants
const CROP_SIZE = 280;

// Keyframes
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const pulseBorder = keyframes`
    0%, 100% { border-color: #3b82f6; }
    50% { border-color: #60a5fa; }
`;

// Styled Components
const ProfileImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 144,
    height: 144,
    borderRadius: theme.shape.borderRadius * 2,
    border: `2px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.grey[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        '&::before': {
            opacity: 1,
        },
    },
}));

const ModalContainer = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 540,
    maxHeight: '95vh',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: `${slideUp} 0.3s ease-out`,
}));

const ModalHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
    padding: theme.spacing(2, 3),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const CropContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isDragging'
})(({ theme, isDragging }) => ({
    position: 'relative',
    width: CROP_SIZE,
    height: CROP_SIZE,
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 1.5,
    background: '#1a1a1a',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const DraggableImage = styled('img')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: 'none',
    maxHeight: 'none',
    transformOrigin: 'center',
    pointerEvents: 'none',
});

const CropOverlay = styled(Box)({
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 10,
});

const CropGrid = styled(Box)({
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    pointerEvents: 'none',
    opacity: 0.3,
    '& > div': {
        border: '1px solid rgba(255, 255, 255, 0.5)',
    },
});

const CornerIndicator = styled(Box)(({ position }) => {
    const styles = {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#3b82f6',
        borderStyle: 'solid',
    };
    
    switch(position) {
        case 'tl':
            return { ...styles, top: 0, left: 0, borderWidth: '3px 0 0 3px', borderTopLeftRadius: 8 };
        case 'tr':
            return { ...styles, top: 0, right: 0, borderWidth: '3px 3px 0 0', borderTopRightRadius: 8 };
        case 'bl':
            return { ...styles, bottom: 0, left: 0, borderWidth: '0 0 3px 3px', borderBottomLeftRadius: 8 };
        case 'br':
            return { ...styles, bottom: 0, right: 0, borderWidth: '0 3px 3px 0', borderBottomRightRadius: 8 };
        default:
            return styles;
    }
});

const PositionHint = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: 11,
    pointerEvents: 'none',
    opacity: 0.8,
    zIndex: 20,
    backdropFilter: 'blur(4px)',
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
}));

const ControlButton = styled(Button)(({ theme }) => ({
    flex: 1,
    backgroundColor: 'white',
    color: theme.palette.grey[700],
    textTransform: 'none',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
}));

const ZoomButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32,
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
    color: 'white',
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        boxShadow: '0 15px 20px -3px rgba(59, 130, 246, 0.4)',
        transform: 'translateY(-2px)',
    },
}));

const UploadArea = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
        transform: 'translateY(-2px)',
    },
}));

const UploadIconContainer = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    background: 'linear-gradient(to bottom right, #dbeafe, #e9d5ff)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2.5),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
}));

const ModeToggleButton = styled(ToggleButton)(({ theme }) => ({
    flex: 1,
    textTransform: 'none',
    padding: theme.spacing(1.5, 2),
    borderRadius: `${theme.shape.borderRadius}px !important`,
    border: 'none !important',
    '&.Mui-selected': {
        backgroundColor: 'white',
        color: theme.palette.primary.main,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
            backgroundColor: 'white',
        },
    },
    '&:not(.Mui-selected)': {
        color: theme.palette.grey[600],
        '&:hover': {
            color: theme.palette.grey[800],
            backgroundColor: 'transparent',
        },
    },
}));

const VideoContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    backgroundColor: '#111827',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}));

const CountdownOverlay = styled(Box)({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const CountdownText = styled(Typography)({
    color: 'white',
    fontSize: '4.5rem',
    fontWeight: 'bold',
    opacity: 0.5,
});

export default function PhotoUploader({ profileImage: externalProfileImage, onProfileImageChange }) {
    // State management
    const [profileImage, setProfileImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomSlider, setZoomSlider] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isDownload, setIsDownload] = useState(true);
    const [isTakePictureActive, setIsTakePictureActive] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [tempImageFile, setTempImageFile] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showModeSelection, setShowModeSelection] = useState(false);
    const [activeMode, setActiveMode] = useState('upload');
    const [showProfilePreview, setShowProfilePreview] = useState(false);

    // Position state for dragging
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaStream = useRef(null);
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);

    // Sync external profile image with internal state
    useEffect(() => {
        if (externalProfileImage) {
            if (typeof externalProfileImage === 'string' && externalProfileImage.startsWith('data:')) {
                fetch(externalProfileImage)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                        setProfileImage(file);
                    });
            } else if (externalProfileImage instanceof File) {
                setProfileImage(externalProfileImage);
            }
        } else {
            setProfileImage(null);
        }
    }, [externalProfileImage]);

    // Get image dimensions when tempImage changes
    useEffect(() => {
        if (tempImage) {
            const img = new Image();
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
            };
            img.src = tempImage;
        }
    }, [tempImage]);

    // Reset position when image changes
    useEffect(() => {
        setPosition({ x: 0, y: 0 });
    }, [tempImage]);

    // Image processing function with position support
    const processImage = useCallback(async (imageFile, zoom, rotate, pos) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const containerSize = CROP_SIZE;
                canvas.width = containerSize;
                canvas.height = containerSize;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const scaledWidth = img.width * zoom;
                const scaledHeight = img.height * zoom;

                const centerX = containerSize / 2;
                const centerY = containerSize / 2;

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate((rotate * Math.PI) / 180);

                ctx.drawImage(
                    img,
                    -scaledWidth / 2 + pos.x,
                    -scaledHeight / 2 + pos.y,
                    scaledWidth,
                    scaledHeight
                );

                ctx.restore();

                canvas.toBlob((blob) => {
                    const processedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                    resolve(processedFile);
                }, 'image/jpeg', 0.95);
            };
        });
    }, []);

    // Helper: convert File → Base64 string
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    // Mouse/Touch handlers for dragging
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        setDragStart({
            x: clientX - position.x,
            y: clientY - position.y
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        const scaledWidth = imageSize.width * zoomLevel;
        const scaledHeight = imageSize.height * zoomLevel;

        const maxOffsetX = Math.max(0, (scaledWidth - CROP_SIZE) / 2 + 50);
        const maxOffsetY = Math.max(0, (scaledHeight - CROP_SIZE) / 2 + 50);

        setPosition({
            x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
            y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY))
        });
    }, [isDragging, dragStart, zoomLevel, imageSize]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add global mouse/touch event listeners when dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);

    // Confirm handler
    const handleConfirm = async () => {
        if (activeMode === 'profile') {
            if (profileImage) {
                setTempImage(URL.createObjectURL(profileImage));
                setTempImageFile(profileImage);
                resetTransformations();
                setShowProfilePreview(false);
                setShowModeSelection(false);
                setActiveMode('upload');
            }
            return;
        }

        if (tempImageFile) {
            const processedFile = await processImage(tempImageFile, zoomLevel, rotation, position);
            setProfileImage(processedFile);
            const base64Image = await fileToBase64(processedFile);

            if (onProfileImageChange) {
                onProfileImageChange(base64Image);
            }

            localStorage.setItem('profileImage', base64Image);
        }

        setShowProfilePreview(false);
        setTempImage(null);
        setTempImageFile(null);
        setActiveMode('upload');
        closeModal();
    };

    // Handle removal
    const handleRemove = () => {
        setProfileImage(null);
        localStorage.removeItem('profileImage');

        if (onProfileImageChange) {
            onProfileImageChange(null);
        }
    };

    // Keep current profile handler
    const handleKeepCurrentProfile = () => {
        if (profileImage) {
            setTempImage(URL.createObjectURL(profileImage));
            setTempImageFile(profileImage);
            resetTransformations();
            cleanupCamera();
            setIsDownload(false);
            setShowModeSelection(false);
            setShowProfilePreview(true);
            setActiveMode('profile');
        }
    };

    // Image upload handler
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setTempImage(URL.createObjectURL(file));
            setTempImageFile(file);
            resetTransformations();
            setZoomSlider(0);
            setZoomLevel(1);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
            setShowModeSelection(false);
        }
    };

    // Rotation handler
    const applyRotation = () => {
        setRotation(prev => (prev + 90) % 360);
        setPosition({ x: 0, y: 0 });
    };

    // Camera handlers
    const handleTakePicture = async () => {
        setTempImage(null);
        setTempImageFile(null);
        setShowProfilePreview(false);
        setShowModeSelection(false);

        setActiveMode('camera');
        setIsTakePictureActive(true);
        setIsDownload(false);
        setShowCamera(true);

        try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = mediaStream.current;
            videoRef.current.play();
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const handleCapture = () => {
        setIsCapturing(true);
        setLoadingProgress(0);

        const interval = 50;
        const totalTime = 3000;
        let elapsed = 0;

        const progressTimer = setInterval(() => {
            elapsed += interval;
            setLoadingProgress((elapsed / totalTime) * 100);

            if (elapsed >= totalTime) {
                clearInterval(progressTimer);
                captureImageFrame();
            }
        }, interval);
    };

    const captureImageFrame = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

            setTempImage(URL.createObjectURL(file));
            setTempImageFile(file);
            resetTransformations();

            cleanupCamera();
            setShowCamera(false);
            setShowModeSelection(false);
            setIsTakePictureActive(false);
            setActiveMode('upload');
        }, 'image/jpeg', 0.95);
    };

    // Utility functions
    const cleanupCamera = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }

        setShowCamera(false);
        setIsTakePictureActive(false);
        setIsCapturing(false);
        setLoadingProgress(0);
        setActiveMode('upload');
    };

    const resetTransformations = () => {
        setZoomSlider(0);
        setZoomLevel(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTempImage(null);
        setTempImageFile(null);
        resetTransformations();
        cleanupCamera();
        setIsDownload(true);
        setShowModeSelection(false);
    };

    const handleUploadNew = () => {
        setShowModeSelection(true);
        setTempImage(null);
        setTempImageFile(null);
        setIsDownload(true);
        setIsTakePictureActive(false);
        cleanupCamera();
    };

    const centerImage = () => {
        setPosition({ x: 0, y: 0 });
    };

    const handleZoomChange = (event, newValue) => {
        setZoomSlider(newValue);
        setZoomLevel(1 + (newValue / 100) * 2);
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        if (!externalProfileImage) {
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                fetch(savedImage)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                        setProfileImage(file);
                        if (onProfileImageChange) {
                            onProfileImageChange(savedImage);
                        }
                    });
            }
        }
    }, [externalProfileImage, onProfileImageChange]);

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.backgroundColor = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.backgroundColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setTempImage(URL.createObjectURL(file));
            setTempImageFile(file);
            resetTransformations();
            setShowModeSelection(false);
        }
    };

    return (
        <Box>
            {/* Profile Image Preview */}
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
                Profile Photo
            </Typography>
            
            <ProfileImageContainer
                onClick={() => {
                    if (profileImage) {
                        const file = profileImage;
                        setTempImage(URL.createObjectURL(file));
                        setTempImageFile(file);
                        setIsDownload(true);
                        setIsModalOpen(true);
                        resetTransformations();
                        setShowModeSelection(false);
                    } else {
                        setIsModalOpen(true);
                        setShowModeSelection(true);
                    }
                }}
            >
                {profileImage ? (
                    <Box
                        component="img"
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile"
                        sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                ) : (
                    <Box textAlign="center" p={2}>
                        <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                            Add Photo
                        </Typography>
                    </Box>
                )}
            </ProfileImageContainer>

            {/* Remove Button */}
            {profileImage && (
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    size="small"
                    onClick={handleRemove}
                    sx={{ mt: 1.5, textTransform: 'none' }}
                >
                    Remove Photo
                </Button>
            )}

            {/* Modal */}
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                sx={{
                    '& .MuiBackdrop-root': {
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <ModalContainer>
                    {/* Modal Header */}
                    <ModalHeader>
                        <Typography variant="h6" fontWeight="bold">
                            Edit Profile Photo
                        </Typography>
                        <IconButton
                            onClick={closeModal}
                            sx={{
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>

                    {/* Modal Body */}
                    <Box sx={{ p: 3 }}>
                        {/* Mode Selector Buttons */}
                        {(showModeSelection || !tempImage || activeMode === 'camera' || activeMode === 'profile') && (
                            <ToggleButtonGroup
                                value={activeMode}
                                exclusive
                                fullWidth
                                sx={{
                                    mb: 3,
                                    backgroundColor: 'grey.100',
                                    borderRadius: 2,
                                    p: 0.5,
                                    '& .MuiToggleButtonGroup-grouped': {
                                        border: 'none',
                                        borderRadius: '8px !important',
                                    },
                                }}
                            >
                                <ModeToggleButton
                                    value="upload"
                                    onClick={() => {
                                        setActiveMode('upload');
                                        setIsDownload(true);
                                        setIsTakePictureActive(false);
                                        cleanupCamera();
                                        setShowModeSelection(false);
                                        setTempImage(null);
                                        setTempImageFile(null);
                                        setShowProfilePreview(false);
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CloudUploadIcon fontSize="small" />
                                        <span>Upload</span>
                                    </Stack>
                                </ModeToggleButton>

                                <ModeToggleButton
                                    value="camera"
                                    onClick={() => {
                                        setActiveMode('camera');
                                        handleTakePicture();
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CameraAltIcon fontSize="small" />
                                        <span>Camera</span>
                                    </Stack>
                                </ModeToggleButton>

                                {profileImage && (
                                    <ModeToggleButton
                                        value="profile"
                                        onClick={() => {
                                            setActiveMode('profile');
                                            handleKeepCurrentProfile();
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PersonIcon fontSize="small" />
                                            <span>Current</span>
                                        </Stack>
                                    </ModeToggleButton>
                                )}
                            </ToggleButtonGroup>
                        )}

                        {/* Content Area */}
                        {showProfilePreview && activeMode === 'profile' ? (
                            // Profile Preview
                            <Stack spacing={3}>
                                <Box display="flex" justifyContent="center">
                                    <Box
                                        sx={{
                                            width: 288,
                                            height: 288,
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            bgcolor: 'grey.100',
                                            border: 2,
                                            borderColor: 'grey.200',
                                            boxShadow: 3,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={tempImage}
                                            alt="Profile Preview"
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <GradientButton onClick={handleConfirm}>
                                        Use This Photo
                                    </GradientButton>
                                </Box>
                            </Stack>
                        ) : tempImage && !showModeSelection ? (
                            // Edit Mode with Positioning
                            <Stack spacing={2}>
                                {/* Crop Container */}
                                <Box display="flex" justifyContent="center">
                                    <CropContainer
                                        ref={imageContainerRef}
                                        isDragging={isDragging}
                                        onMouseDown={handleMouseDown}
                                        onTouchStart={handleMouseDown}
                                    >
                                        <DraggableImage
                                            ref={imageRef}
                                            src={tempImage}
                                            alt="Preview"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                                                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                                            }}
                                            draggable={false}
                                        />

                                        <CropOverlay>
                                            <CropGrid>
                                                {[...Array(9)].map((_, i) => (
                                                    <Box key={i} />
                                                ))}
                                            </CropGrid>

                                            <CornerIndicator position="tl" />
                                            <CornerIndicator position="tr" />
                                            <CornerIndicator position="bl" />
                                            <CornerIndicator position="br" />
                                        </CropOverlay>

                                        <PositionHint>
                                            Drag to reposition
                                        </PositionHint>
                                    </CropContainer>
                                </Box>

                                {/* Controls */}
                                <ControlsContainer>
                                    <Stack spacing={2}>
                                        {/* Zoom Control */}
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ width: 48 }}>
                                                Zoom
                                            </Typography>
                                            <ZoomButton
                                                size="small"
                                                onClick={() => {
                                                    const newSlider = Math.max(0, zoomSlider - 10);
                                                    setZoomSlider(newSlider);
                                                    setZoomLevel(1 + (newSlider / 100) * 2);
                                                }}
                                            >
                                                −
                                            </ZoomButton>
                                            <Slider
                                                value={zoomSlider}
                                                onChange={handleZoomChange}
                                                min={0}
                                                max={100}
                                                sx={{ flex: 1 }}
                                            />
                                            <ZoomButton
                                                size="small"
                                                onClick={() => {
                                                    const newSlider = Math.min(100, zoomSlider + 10);
                                                    setZoomSlider(newSlider);
                                                    setZoomLevel(1 + (newSlider / 100) * 2);
                                                }}
                                            >
                                                +
                                            </ZoomButton>
                                        </Stack>

                                        {/* Rotate & Center Controls */}
                                        <Stack direction="row" spacing={2}>
                                            <ControlButton
                                                startIcon={<RotateRightIcon />}
                                                onClick={applyRotation}
                                            >
                                                Rotate 90°
                                            </ControlButton>
                                            <ControlButton
                                                startIcon={<CenterFocusStrongIcon />}
                                                onClick={centerImage}
                                            >
                                                Center
                                            </ControlButton>
                                        </Stack>
                                    </Stack>
                                </ControlsContainer>

                                {/* Action Buttons */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        pt: 1,
                                        borderTop: 1,
                                        borderColor: 'grey.100',
                                    }}
                                >
                                    <Button
                                        startIcon={<FileUploadIcon />}
                                        onClick={handleUploadNew}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Change Photo
                                    </Button>

                                    <GradientButton onClick={handleConfirm}>
                                        Save Photo
                                    </GradientButton>
                                </Box>
                            </Stack>
                        ) : showCamera ? (
                            // Camera Mode
                            <Stack spacing={3}>
                                <VideoContainer>
                                    <Box
                                        component="video"
                                        ref={videoRef}
                                        sx={{
                                            width: '100%',
                                            height: 320,
                                            objectFit: 'cover',
                                            transform: 'scaleX(-1)',
                                        }}
                                        autoPlay
                                    />
                                    {isCapturing && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={loadingProgress}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: 4,
                                                '& .MuiLinearProgress-bar': {
                                                    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                                                },
                                            }}
                                        />
                                    )}

                                    {isCapturing && (
                                        <CountdownOverlay>
                                            <CountdownText>
                                                {Math.ceil((100 - loadingProgress) / 33.33)}
                                            </CountdownText>
                                        </CountdownOverlay>
                                    )}
                                </VideoContainer>

                                {!isCapturing && (
                                    <Stack direction="row" spacing={2}>
                                        <GradientButton
                                            fullWidth
                                            startIcon={<CameraAltIcon />}
                                            onClick={handleCapture}
                                        >
                                            Capture (3s countdown)
                                        </GradientButton>
                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            onClick={() => {
                                                cleanupCamera();
                                                setShowModeSelection(true);
                                            }}
                                            sx={{
                                                px: 3,
                                                bgcolor: 'grey.200',
                                                color: 'grey.700',
                                                '&:hover': { bgcolor: 'grey.300' },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        ) : (
                            // Upload Mode
                            <UploadArea
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <UploadIconContainer>
                                    <ImageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                </UploadIconContainer>
                                <Typography color="text.primary" textAlign="center" mb={1}>
                                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                        Click to upload
                                    </Box>{' '}
                                    or drag and drop
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    PNG, JPG, GIF up to 10MB
                                </Typography>
                            </UploadArea>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </Box>
                </ModalContainer>
            </Modal>
        </Box>
    );
}