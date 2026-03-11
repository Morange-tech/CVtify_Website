import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Alert,
    Collapse,
    styled,
    keyframes
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const ReactQuill = dynamic(
    () => import("react-quill-new"),
    {
        ssr: false,
        loading: () => (
            <Box sx={{ height: 128, border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">Loading editor...</Typography>
            </Box>
        )
    }
);

const MAX_CHARACTERS = 500;

// Keyframes for animations
const shakeAnimation = keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

const pulseWarning = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
`;

// Styled components
const QuillWrapper = styled(Paper, {
    shouldForwardProp: (prop) => !['isOverLimit', 'showWarning', 'shake'].includes(prop)
})(({ theme, isOverLimit, showWarning, shake }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: 'border-color 0.3s ease',
    borderColor: isOverLimit 
        ? theme.palette.error.main 
        : showWarning 
            ? theme.palette.warning.main 
            : theme.palette.grey[300],
    ...(shake && {
        animation: `${shakeAnimation} 0.5s ease-in-out`,
    }),
    '& .ql-container': {
        borderRadius: '0 0 8px 8px',
        borderColor: isOverLimit 
            ? theme.palette.error.main 
            : showWarning 
                ? theme.palette.warning.main 
                : theme.palette.grey[300],
    },
    '& .ql-toolbar': {
        borderRadius: '8px 8px 0 0',
        borderColor: isOverLimit 
            ? theme.palette.error.main 
            : showWarning 
                ? theme.palette.warning.main 
                : theme.palette.grey[300],
    },
}));

const ProgressBarContainer = styled(Box)(({ theme }) => ({
    height: 4,
    backgroundColor: theme.palette.grey[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: theme.spacing(1),
}));

const ProgressBarFill = styled(Box, {
    shouldForwardProp: (prop) => !['progressColor', 'pulse'].includes(prop)
})(({ progressColor, pulse }) => ({
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    backgroundColor: progressColor,
    ...(pulse && {
        animation: `${pulseWarning} 1.5s ease-in-out infinite`,
    }),
}));

const StatusChip = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'statusColor'
})(({ theme, statusColor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: statusColor,
    marginLeft: theme.spacing(1),
}));

const AIButton = styled(Button)(({ theme }) => ({
    '& .MuiButton-startIcon': {
        transition: 'transform 0.3s ease',
    },
    '&:hover .MuiButton-startIcon': {
        transform: 'rotate(180deg)',
    },
}));

const Dot = styled(Box)(({ theme }) => ({
    width: 4,
    height: 4,
    backgroundColor: theme.palette.grey[300],
    borderRadius: '50%',
}));

const ProfileSection = ({ cvData, setCvData }) => {
    const [charCount, setCharCount] = useState(0);
    const [isOverLimit, setIsOverLimit] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [lastValidContent, setLastValidContent] = useState(cvData.profile || '');
    const [isShaking, setIsShaking] = useState(false);
    const quillRef = useRef(null);

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: ["", "center", "right", "justify"] }],
            ["link"],
            ["clean"],
        ],
    }), []);

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "link",
        "align",
    ];

    // Function to strip HTML and count characters
    const countCharacters = useCallback((html) => {
        if (!html) return 0;

        const text = html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&[a-zA-Z]+;/g, ' ');

        return text.length;
    }, []);

    // Function to get plain text from HTML
    const getPlainText = useCallback((html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&[a-zA-Z]+;/g, ' ');
    }, []);

    // Function to count words
    const countWords = useCallback((html) => {
        const text = getPlainText(html).trim();
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }, [getPlainText]);

    // Update character count when cvData.profile changes
    useEffect(() => {
        const count = countCharacters(cvData.profile);
        setCharCount(count);
        setIsOverLimit(count > MAX_CHARACTERS);
        setShowWarning(count >= MAX_CHARACTERS * 0.9);
    }, [cvData.profile, countCharacters]);

    // Handle content change with character limit
    const handleChange = useCallback((value, delta, source, editor) => {
        const newCharCount = countCharacters(value);

        if (source === 'user' && newCharCount > MAX_CHARACTERS) {
            setIsOverLimit(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);

            setCvData((prev) => ({
                ...prev,
                profile: lastValidContent,
            }));

            return;
        }

        setLastValidContent(value);
        setCvData((prev) => ({
            ...prev,
            profile: value,
        }));

        setCharCount(newCharCount);
        setIsOverLimit(false);
        setShowWarning(newCharCount >= MAX_CHARACTERS * 0.9);
    }, [countCharacters, setCvData, lastValidContent]);

    // Calculate progress percentage
    const progressPercentage = Math.min((charCount / MAX_CHARACTERS) * 100, 100);

    // Determine colors based on character count
    const getProgressColor = useCallback(() => {
        if (charCount > MAX_CHARACTERS) return '#ef4444'; // red
        if (charCount >= MAX_CHARACTERS * 0.9) return '#f97316'; // orange
        if (charCount >= MAX_CHARACTERS * 0.7) return '#eab308'; // yellow
        return '#22c55e'; // green
    }, [charCount]);

    const getTextColor = useCallback(() => {
        if (charCount > MAX_CHARACTERS) return 'error.main';
        if (charCount >= MAX_CHARACTERS * 0.9) return 'warning.main';
        return 'text.secondary';
    }, [charCount]);

    const shouldPulse = showWarning && !isOverLimit;

    return (
        <QuillWrapper 
            variant="outlined" 
            isOverLimit={isOverLimit} 
            showWarning={showWarning}
            shake={isShaking}
        >
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={cvData.profile}
                onChange={handleChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Commencez à rédiger ici..."
                className="custom-quill"
            />

            {/* Character Count Indicator */}
            <Stack spacing={1} sx={{ mt: 2 }}>
                {/* Progress Bar */}
                <ProgressBarContainer>
                    <ProgressBarFill
                        progressColor={getProgressColor()}
                        pulse={shouldPulse}
                        sx={{ width: `${progressPercentage}%` }}
                    />
                </ProgressBarContainer>

                {/* Character Count Text */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ 
                                color: getTextColor(), 
                                fontVariantNumeric: 'tabular-nums' 
                            }}
                        >
                            {charCount} / {MAX_CHARACTERS}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            characters
                        </Typography>

                        {/* Status Icons */}
                        {charCount > MAX_CHARACTERS && (
                            <StatusChip statusColor="#dc2626">
                                <WarningAmberIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption" fontWeight="medium">
                                    Limit reached!
                                </Typography>
                            </StatusChip>
                        )}

                        {charCount >= MAX_CHARACTERS * 0.9 && charCount <= MAX_CHARACTERS && (
                            <StatusChip statusColor="#ea580c">
                                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                    Almost full
                                </Typography>
                            </StatusChip>
                        )}

                        {charCount < MAX_CHARACTERS * 0.9 && charCount > 0 && (
                            <StatusChip statusColor="#16a34a">
                                <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                            </StatusChip>
                        )}
                    </Stack>

                    {/* Remaining characters */}
                    <Typography
                        variant="caption"
                        sx={{ 
                            color: getTextColor(), 
                            fontVariantNumeric: 'tabular-nums' 
                        }}
                    >
                        {charCount <= MAX_CHARACTERS ? (
                            `${MAX_CHARACTERS - charCount} remaining`
                        ) : (
                            <Box component="span" sx={{ color: 'error.main', fontWeight: 500 }}>
                                {charCount - MAX_CHARACTERS} over limit
                            </Box>
                        )}
                    </Typography>
                </Box>
            </Stack>

            {/* Warning Message when at limit */}
            <Collapse in={charCount >= MAX_CHARACTERS}>
                <Alert
                    severity={isOverLimit ? "error" : "warning"}
                    icon={<WarningAmberIcon />}
                    sx={{ mt: 2 }}
                >
                    <Typography variant="body2" fontWeight="medium">
                        {isOverLimit ? 'Character limit reached' : "You've reached the maximum"}
                    </Typography>
                    <Typography variant="caption">
                        {isOverLimit
                            ? 'You cannot add more text. Please delete some characters first.'
                            : `You have used all ${MAX_CHARACTERS} characters. Delete text to add more.`
                        }
                    </Typography>
                </Alert>
            </Collapse>

            {/* Footer with word count and AI button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Word count (additional info) */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="caption" color="text.secondary">
                        {countWords(cvData.profile)} words
                    </Typography>
                    <Dot />
                    <Typography variant="caption" color="text.secondary">
                        {charCount} characters
                    </Typography>
                </Stack>

                <AIButton
                    variant="contained"
                    startIcon={<AutoFixHighIcon />}
                    disabled={charCount === 0}
                >
                    Suggestions de l'IA
                </AIButton>
            </Box>
        </QuillWrapper>
    );
};

export default ProfileSection;