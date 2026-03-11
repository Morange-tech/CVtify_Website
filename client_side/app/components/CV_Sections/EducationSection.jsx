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
    LinearProgress,
    Alert,
    Chip,
    Card,
    CardContent,
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
const ShakeWrapper = styled(Box)(({ theme, shake }) => ({
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

const ProgressFill = styled(Box)(({ theme, color, pulse }) => ({
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    backgroundColor: color,
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

const EducationSection = ({
    cvData,
    setCvData,
    currentEducation,
    setCurrentEducation,
    showEducationForm,
    setShowEducationForm,
    editingIndex,
    setEditingIndex,
    quillModules,
    quillFormats,
    addTraining
}) => {
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const lastValidDescriptionRef = useRef('');

    // Month options
    const months = useMemo(() => [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ], []);

    // Generate year options - memoized
    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 40; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    // Function to get plain text from HTML - stable reference
    const getPlainText = useCallback((html) => {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\u00A0/g, ' ');
        return text;
    }, []);

    // Function to count characters - stable reference
    const countCharacters = useCallback((html) => {
        return getPlainText(html).length;
    }, [getPlainText]);

    // Update character count when description changes (for display only)
    useEffect(() => {
        const count = countCharacters(currentEducation.description);
        setDescriptionCharCount(count);
        setIsDescriptionOverLimit(count > MAX_DESCRIPTION_CHARS);
    }, [currentEducation.description, countCharacters]);

    // Initialize lastValidDescriptionRef when form opens or editing starts
    useEffect(() => {
        if (editingIndex !== null || showEducationForm) {
            lastValidDescriptionRef.current = currentEducation.description || '';
        }
    }, [editingIndex, showEducationForm]);

    // Handle description change
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
        setCurrentEducation(prev => ({
            ...prev,
            description: value
        }));
        setDescriptionCharCount(newCharCount);
        setIsDescriptionOverLimit(false);
    }, [countCharacters, setCurrentEducation]);

    // Get progress color
    const getProgressColor = useCallback(() => {
        const percentage = (descriptionCharCount / MAX_DESCRIPTION_CHARS) * 100;
        if (percentage > 100) return '#ef4444'; // red-500
        if (percentage >= 90) return '#f97316'; // orange-500
        if (percentage >= 70) return '#eab308'; // yellow-500
        return '#22c55e'; // green-500
    }, [descriptionCharCount]);

    // Get text color
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

    const updateEducation = (index) => {
        setCvData(prev => {
            const updated = [...prev.education];
            updated[index] = { ...currentEducation };
            return { ...prev, education: updated };
        });
        setEditingIndex(null);
        setCurrentEducation({
            education: "",
            school: "",
            city: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            isPresent: false,
            description: ""
        });
        setShowEducationForm(false);
        setDescriptionCharCount(0);
        lastValidDescriptionRef.current = '';
    };

    const removeEducation = (index) => {
        setCvData(prev => {
            const updatedEducation = prev.education.filter((_, i) => i !== index);
            return { ...prev, education: updatedEducation };
        });
        if (editingIndex === index) {
            setEditingIndex(null);
            setCurrentEducation({
                education: "",
                school: "",
                city: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isPresent: false,
                description: ""
            });
            setDescriptionCharCount(0);
            lastValidDescriptionRef.current = '';
        }
    };

    const handleCancelForm = () => {
        setCurrentEducation({
            education: "",
            school: "",
            city: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            isPresent: false,
            description: ""
        });
        setShowEducationForm(false);
        setDescriptionCharCount(0);
        lastValidDescriptionRef.current = '';
    };

    // Render the education form (used for both add and edit)
    const renderEducationForm = (isEditing = false, index = null) => (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Training Input */}
                <TextField
                    fullWidth
                    label="Training"
                    value={currentEducation.education || ""}
                    onChange={(e) => setCurrentEducation(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    variant="outlined"
                    size="small"
                />

                {/* School and City */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="School"
                            value={currentEducation.school || ""}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, school: e.target.value }))}
                            placeholder="e.g., University of Technology"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="City"
                            value={currentEducation.city || ""}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, city: e.target.value }))}
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
                                        value={currentEducation.startMonth || ""}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, startMonth: e.target.value }))}
                                        label="Month"
                                    >
                                        <MenuItem value="">Month</MenuItem>
                                        {months.map(month => (
                                            <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={currentEducation.startYear || ""}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, startYear: e.target.value }))}
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
                                        checked={currentEducation.isPresent || false}
                                        onChange={() => setCurrentEducation(prev => ({ ...prev, isPresent: !prev.isPresent }))}
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
                                <FormControl fullWidth size="small" disabled={currentEducation.isPresent}>
                                    <InputLabel>Month</InputLabel>
                                    <Select
                                        value={currentEducation.endMonth || ""}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, endMonth: e.target.value }))}
                                        label="Month"
                                    >
                                        <MenuItem value="">Month</MenuItem>
                                        {months.map(month => (
                                            <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small" disabled={currentEducation.isPresent}>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={currentEducation.endYear || ""}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, endYear: e.target.value }))}
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
                        shake={isShaking ? 'true' : undefined}
                        sx={{
                            border: 1,
                            borderColor: getBorderColor(),
                            borderRadius: 1,
                        }}
                    >
                        <ReactQuill
                            theme="snow"
                            value={currentEducation.description || ""}
                            onChange={handleDescriptionChange}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Describe your education, achievements, courses, etc..."
                            style={{ minHeight: '120px' }}
                        />
                    </ShakeWrapper>

                    {/* Character Count Section */}
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {/* Progress Bar */}
                        <ProgressBar>
                            <ProgressFill
                                color={getProgressColor()}
                                pulse={shouldPulse ? shouldPulse.toString() : undefined}
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
                            onClick={isEditing ? () => removeEducation(index) : handleCancelForm}
                            title={isEditing ? "Delete" : "Cancel"}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={isEditing ? () => updateEducation(index) : addTraining}
                            disabled={isDescriptionOverLimit}
                        >
                            Finish
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );

    // Render education entry display
    const renderEducationDisplay = (edu, index) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
                <Typography fontWeight="medium" color="text.primary">
                    {edu.education || "No degree specified"}
                    {edu.school && ` - ${edu.school}`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    {edu.city && (
                        <Typography variant="body2" color="text.secondary">
                            {edu.city}
                        </Typography>
                    )}
                    {(edu.startMonth || edu.startYear || edu.endMonth || edu.endYear || edu.isPresent) && (
                        <>
                            <Typography variant="body2" color="text.secondary">•</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {edu.startMonth && `${edu.startMonth}/`}{edu.startYear || 'Start'}
                                {' - '}
                                {edu.isPresent ? 'Present' : `${edu.endMonth && `${edu.endMonth}/`}${edu.endYear || 'End'}`}
                            </Typography>
                        </>
                    )}
                </Stack>
                {edu.description && edu.description !== "<p><br></p>" && (
                    <Box
                        sx={{
                            mt: 1,
                            '& p': { m: 0 },
                            '& ul, & ol': { m: 0, pl: 2 },
                        }}
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                    />
                )}
            </Box>
            <IconButton
                color="primary"
                onClick={() => {
                    setEditingIndex(index);
                    setCurrentEducation({ ...edu });
                    lastValidDescriptionRef.current = edu.description || '';
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
            {/* Existing education entries */}
            {cvData.education.map((edu, index) => (
                <Paper key={edu.id || index} variant="outlined" sx={{ p: 2 }}>
                    {editingIndex === index ? (
                        renderEducationForm(true, index)
                    ) : (
                        renderEducationDisplay(edu, index)
                    )}
                </Paper>
            ))}

            {/* Add new education form */}
            <Collapse in={showEducationForm && editingIndex === null}>
                {renderEducationForm(false)}
            </Collapse>

            {/* Add button */}
            {!showEducationForm && editingIndex === null && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <AddButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setShowEducationForm(true);
                            setDescriptionCharCount(0);
                            lastValidDescriptionRef.current = '';
                        }}
                    >
                        Add a Training
                    </AddButton>
                </Box>
            )}
        </Stack>
    );
};

export default EducationSection;