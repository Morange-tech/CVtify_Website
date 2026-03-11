import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Button,
    Typography,
    IconButton,
    Paper,
    Grid,
    Stack,
    Divider,
    Alert,
    Chip,
    Collapse,
    styled,
    keyframes
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
import "react-quill-new/dist/quill.snow.css";

const MAX_DESCRIPTION_CHARS = 300;

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
const ShakeWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'shake'
})(({ theme, shake }) => ({
    borderRadius: theme.shape.borderRadius,
    transition: 'border-color 0.3s ease',
    ...(shake && {
        animation: `${shakeAnimation} 0.5s ease-in-out`,
    }),
    '& .ql-container': {
        borderRadius: '0 0 8px 8px',
    },
    '& .ql-toolbar': {
        borderRadius: '8px 8px 0 0',
    },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
    height: 4,
    backgroundColor: theme.palette.grey[200],
    borderRadius: 2,
    overflow: 'hidden',
}));

const ProgressFill = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'progressColor' && prop !== 'pulse'
})(({ theme, progressColor, pulse }) => ({
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    backgroundColor: progressColor,
    ...(pulse && {
        animation: `${pulseWarning} 1.5s ease-in-out infinite`,
    }),
}));

const AddButton = styled(Button)(({ theme }) => ({
    borderStyle: 'dashed',
    borderColor: theme.palette.grey[300],
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const ExperienceSection = ({ cvData, setCvData }) => {
    const [currentExperience, setCurrentExperience] = useState({
        position: "",
        employer: "",
        city: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isPresent: false,
        description: ""
    });

    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [showExperienceForm, setShowExperienceForm] = useState(true);
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // Use ref to avoid re-render loops
    const lastValidDescriptionRef = useRef('');

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

    // Memoized year options
    const yearOptions = useMemo(() => {
        return Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);
    }, []);

    // Month options
    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return { value: month, label: monthNames[i] };
        });
    }, []);

    // Function to get plain text from HTML
    const getPlainText = useCallback((html) => {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\u00A0/g, ' ');
        return text;
    }, []);

    // Function to count characters
    const countCharacters = useCallback((html) => {
        return getPlainText(html).length;
    }, [getPlainText]);

    // Update character count when description changes
    useEffect(() => {
        const count = countCharacters(currentExperience.description);
        setDescriptionCharCount(count);
        setIsDescriptionOverLimit(count > MAX_DESCRIPTION_CHARS);
    }, [currentExperience.description, countCharacters]);

    // Initialize lastValidDescriptionRef when form opens or editing starts
    useEffect(() => {
        if (editingExperienceIndex !== null || showExperienceForm) {
            lastValidDescriptionRef.current = currentExperience.description || '';
        }
    }, [editingExperienceIndex, showExperienceForm]);

    // Handle description change with character limit
    const handleDescriptionChange = useCallback((value) => {
        const newCharCount = countCharacters(value);

        if (newCharCount > MAX_DESCRIPTION_CHARS) {
            // Show shake animation
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);

            setIsDescriptionOverLimit(true);
            return;
        }

        lastValidDescriptionRef.current = value;
        setCurrentExperience(prev => ({
            ...prev,
            description: value
        }));
        setDescriptionCharCount(newCharCount);
        setIsDescriptionOverLimit(false);
    }, [countCharacters]);

    // Get progress color
    const getProgressColor = useCallback(() => {
        const percentage = (descriptionCharCount / MAX_DESCRIPTION_CHARS) * 100;
        if (percentage > 100) return '#ef4444'; // red-500
        if (percentage >= 90) return '#f97316'; // orange-500
        if (percentage >= 70) return '#eab308'; // yellow-500
        return '#22c55e'; // green-500
    }, [descriptionCharCount]);

    // Get text color for MUI
    const getTextColor = useCallback(() => {
        const percentage = (descriptionCharCount / MAX_DESCRIPTION_CHARS) * 100;
        if (percentage > 100) return 'error.main';
        if (percentage >= 90) return 'warning.main';
        return 'text.secondary';
    }, [descriptionCharCount]);

    // Get border color
    const getBorderColor = useCallback(() => {
        if (isDescriptionOverLimit) return 'error.main';
        if (descriptionCharCount >= MAX_DESCRIPTION_CHARS * 0.9) return 'warning.main';
        return 'grey.300';
    }, [isDescriptionOverLimit, descriptionCharCount]);

    const progressPercentage = Math.min((descriptionCharCount / MAX_DESCRIPTION_CHARS) * 100, 100);
    const shouldPulse = descriptionCharCount >= MAX_DESCRIPTION_CHARS * 0.9 && !isDescriptionOverLimit;

    const resetForm = () => {
        setCurrentExperience({
            position: "",
            employer: "",
            city: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            isPresent: false,
            description: ""
        });
        setDescriptionCharCount(0);
        setIsDescriptionOverLimit(false);
        lastValidDescriptionRef.current = '';
    };

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                ...currentExperience,
                id: Date.now()
            }]
        }));
        resetForm();
        setShowExperienceForm(false);
    };

    const updateExperience = (index) => {
        setCvData(prev => {
            const updated = [...prev.experience];
            updated[index] = { ...currentExperience };
            return { ...prev, experience: updated };
        });
        setEditingExperienceIndex(null);
        resetForm();
    };

    const removeExperience = (index) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
        if (editingExperienceIndex === index) {
            setEditingExperienceIndex(null);
            resetForm();
        }
    };

    const handleCancelForm = () => {
        resetForm();
        setShowExperienceForm(false);
        setEditingExperienceIndex(null);
    };

    // Render the experience form (used for both add and edit)
    const renderExperienceForm = (isEditing = false, index = null) => (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Position Input */}
                <TextField
                    fullWidth
                    label="Position"
                    value={currentExperience.position || ""}
                    onChange={(e) => setCurrentExperience(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g., Software Developer"
                    variant="outlined"
                    size="small"
                />

                {/* Employer and City */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Employer"
                            value={currentExperience.employer || ""}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, employer: e.target.value }))}
                            placeholder="e.g., Google"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="City"
                            value={currentExperience.city || ""}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="e.g., Paris"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                </Grid>

                {/* Date Selection */}
                <Grid container spacing={3}>
                    {/* Start Date */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Start Date
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Month</InputLabel>
                                    <Select
                                        value={currentExperience.startMonth || ""}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, startMonth: e.target.value }))}
                                        label="Month"
                                    >
                                        <MenuItem value="">Month</MenuItem>
                                        {monthOptions.map(month => (
                                            <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={currentExperience.startYear || ""}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, startYear: e.target.value }))}
                                        label="Year"
                                    >
                                        <MenuItem value="">Year</MenuItem>
                                        {yearOptions.map(year => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* End Date */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                End Date
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentExperience.isPresent || false}
                                        onChange={() => setCurrentExperience(prev => ({ ...prev, isPresent: !prev.isPresent }))}
                                        color="success"
                                        size="small"
                                    />
                                }
                                label="Present"
                                labelPlacement="start"
                                sx={{ mr: 0 }}
                            />
                        </Box>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small" disabled={currentExperience.isPresent}>
                                    <InputLabel>Month</InputLabel>
                                    <Select
                                        value={currentExperience.endMonth || ""}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, endMonth: e.target.value }))}
                                        label="Month"
                                    >
                                        <MenuItem value="">Month</MenuItem>
                                        {monthOptions.map(month => (
                                            <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small" disabled={currentExperience.isPresent}>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={currentExperience.endYear || ""}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, endYear: e.target.value }))}
                                        label="Year"
                                    >
                                        <MenuItem value="">Year</MenuItem>
                                        {yearOptions.map(year => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider />

                {/* Description Section */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="semibold">
                            Description
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Max {MAX_DESCRIPTION_CHARS} characters
                        </Typography>
                    </Box>

                    {/* Description Editor */}
                    <ShakeWrapper
                        shake={isShaking}
                        sx={{
                            border: 1,
                            borderColor: getBorderColor(),
                            borderRadius: 1,
                        }}
                    >
                        <ReactQuill
                            theme="snow"
                            value={currentExperience.description || ""}
                            onChange={handleDescriptionChange}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Describe your responsibilities, achievements, projects..."
                            style={{ minHeight: '120px' }}
                        />
                    </ShakeWrapper>

                    {/* Character Count Section */}
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {/* Progress Bar */}
                        <ProgressBar>
                            <ProgressFill
                                progressColor={getProgressColor()}
                                pulse={shouldPulse}
                                sx={{ width: `${progressPercentage}%` }}
                            />
                        </ProgressBar>

                        {/* Character Count Display */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                    variant="caption"
                                    sx={{ color: getTextColor(), fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}
                                >
                                    {descriptionCharCount} / {MAX_DESCRIPTION_CHARS}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    characters
                                </Typography>

                                {descriptionCharCount >= MAX_DESCRIPTION_CHARS && (
                                    <Chip
                                        icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                                        label="Limit reached"
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{ height: 20, '& .MuiChip-label': { fontSize: '0.7rem', px: 1 } }}
                                    />
                                )}

                                {descriptionCharCount >= MAX_DESCRIPTION_CHARS * 0.9 && descriptionCharCount < MAX_DESCRIPTION_CHARS && (
                                    <Chip
                                        label="Almost full"
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                        sx={{ height: 20, '& .MuiChip-label': { fontSize: '0.7rem', px: 1 } }}
                                    />
                                )}
                            </Stack>

                            <Typography
                                variant="caption"
                                sx={{ color: getTextColor(), fontVariantNumeric: 'tabular-nums' }}
                            >
                                {descriptionCharCount <= MAX_DESCRIPTION_CHARS ? (
                                    `${MAX_DESCRIPTION_CHARS - descriptionCharCount} left`
                                ) : (
                                    <Box component="span" sx={{ color: 'error.main', fontWeight: 500 }}>
                                        {descriptionCharCount - MAX_DESCRIPTION_CHARS} over
                                    </Box>
                                )}
                            </Typography>
                        </Box>

                        {/* Warning Alert */}
                        <Collapse in={descriptionCharCount >= MAX_DESCRIPTION_CHARS}>
                            <Alert
                                severity="error"
                                icon={<WarningAmberIcon fontSize="small" />}
                                sx={{ py: 0.5 }}
                            >
                                <Typography variant="caption">
                                    Character limit reached. Delete some text to add more.
                                </Typography>
                            </Alert>
                        </Collapse>
                    </Stack>
                </Box>

                <Divider />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={<AutoFixHighIcon />}
                        sx={{
                            '& .MuiButton-startIcon': {
                                transition: 'transform 0.3s ease',
                            },
                            '&:hover .MuiButton-startIcon': {
                                transform: 'rotate(180deg)',
                            },
                        }}
                    >
                        AI Suggestions
                    </Button>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            color="error"
                            onClick={isEditing ? () => removeExperience(index) : handleCancelForm}
                            title={isEditing ? "Delete" : "Cancel"}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={isEditing ? () => updateExperience(index) : addExperience}
                            disabled={isDescriptionOverLimit}
                        >
                            Finish
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );

    // Render experience entry display
    const renderExperienceDisplay = (exp, index) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
                <Typography fontWeight="medium" color="text.primary">
                    {exp.position || "No position specified"}
                    {exp.employer && ` - ${exp.employer}`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    {exp.city && (
                        <Typography variant="body2" color="text.secondary">
                            {exp.city}
                        </Typography>
                    )}
                    {(exp.startMonth || exp.startYear || exp.endMonth || exp.endYear || exp.isPresent) && (
                        <>
                            {exp.city && <Typography variant="body2" color="text.secondary">•</Typography>}
                            <Typography variant="body2" color="text.secondary">
                                {exp.startMonth && `${exp.startMonth}/`}{exp.startYear || 'Start'}
                                {' - '}
                                {exp.isPresent ? 'Present' : `${exp.endMonth && `${exp.endMonth}/`}${exp.endYear || 'End'}`}
                            </Typography>
                        </>
                    )}
                </Stack>
                {exp.description && exp.description !== "<p><br></p>" && (
                    <Box
                        sx={{
                            mt: 1,
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                            '& p': { m: 0 },
                            '& ul, & ol': { m: 0, pl: 2 },
                        }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                )}
            </Box>
            <IconButton
                color="primary"
                onClick={() => {
                    setEditingExperienceIndex(index);
                    setCurrentExperience({ ...exp });
                    lastValidDescriptionRef.current = exp.description || '';
                }}
                title="Edit"
                sx={{ ml: 2, flexShrink: 0 }}
            >
                <EditIcon />
            </IconButton>
        </Box>
    );

    return (
        <Stack spacing={3}>
            {/* Existing experience entries */}
            {cvData.experience.map((exp, index) => (
                <Paper key={exp.id || index} variant="outlined" sx={{ p: 2 }}>
                    {editingExperienceIndex === index ? (
                        renderExperienceForm(true, index)
                    ) : (
                        renderExperienceDisplay(exp, index)
                    )}
                </Paper>
            ))}

            {/* Add new experience form */}
            <Collapse in={showExperienceForm && editingExperienceIndex === null}>
                {renderExperienceForm(false)}
            </Collapse>

            {/* Add button */}
            {!showExperienceForm && editingExperienceIndex === null && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <AddButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setShowExperienceForm(true);
                            resetForm();
                        }}
                    >
                        Add an Experience
                    </AddButton>
                </Box>
            )}
        </Stack>
    );
};

export default ExperienceSection;