import React, { useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    IconButton,
    Paper,
    Grid,
    Stack,
    Collapse,
    styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Styled components
const AddButton = styled(Button)(({ theme }) => ({
    borderStyle: 'dashed',
    borderColor: theme.palette.grey[300],
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const AIButton = styled(Button)(({ theme }) => ({
    '& .MuiButton-startIcon': {
        transition: 'transform 0.3s ease',
    },
    '&:hover .MuiButton-startIcon': {
        transform: 'rotate(180deg)',
    },
}));

const LanguagesSection = ({ cvData, setCvData }) => {
    const [currentLanguage, setCurrentLanguage] = useState({ language: "", level: "" });
    const [editingLanguageIndex, setEditingLanguageIndex] = useState(null);
    const [showLanguageForm, setShowLanguageForm] = useState(true);

    // Language level options
    const languageLevels = [
        { value: "01", label: "Beginner" },
        { value: "02", label: "Intermediate" },
        { value: "03", label: "Good" },
        { value: "04", label: "Very Good" },
        { value: "05", label: "Fluent" },
        { value: "06", label: "Native" }
    ];

    const getLanguageLevelDisplayText = (levelCode) => {
        const level = languageLevels.find(l => l.value === levelCode);
        return level ? level.label : levelCode || "Not specified";
    };

    const addLanguage = () => {
        if (!currentLanguage.language || !currentLanguage.level) {
            alert("Please fill in all fields.");
            return;
        }

        const languageToAdd = {
            ...currentLanguage,
            language: String(currentLanguage.language),
            level: String(currentLanguage.level)
        };

        if (editingLanguageIndex !== null) {
            setCvData(prev => {
                const updatedLanguages = [...prev.languages];
                updatedLanguages[editingLanguageIndex] = languageToAdd;
                return { ...prev, languages: updatedLanguages };
            });
            setEditingLanguageIndex(null);
        } else {
            setCvData(prev => ({
                ...prev,
                languages: [...prev.languages, { ...languageToAdd, id: Date.now() }]
            }));
            setShowLanguageForm(false);
        }

        setCurrentLanguage({
            language: "",
            level: "",
        });
    };

    const removeLanguage = (index) => {
        setCvData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = (isEditing, index) => {
        if (isEditing) {
            removeLanguage(index);
            setEditingLanguageIndex(null);
        }
        setCurrentLanguage({
            language: "",
            level: "",
        });
        setShowLanguageForm(false);
    };

    const renderLanguageForm = (isEditing = false, index = null) => {
        return (
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* Language and Level Inputs */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Language"
                                value={currentLanguage.language || ""}
                                onChange={(e) => setCurrentLanguage(prev => ({ ...prev, language: e.target.value }))}
                                placeholder="e.g., English, French, Spanish"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Level</InputLabel>
                                <Select
                                    value={currentLanguage.level || ""}
                                    onChange={(e) => setCurrentLanguage(prev => ({ ...prev, level: e.target.value }))}
                                    label="Level"
                                >
                                    <MenuItem value="">
                                        <em>Choose</em>
                                    </MenuItem>
                                    {languageLevels.map(level => (
                                        <MenuItem key={level.value} value={level.value}>
                                            {level.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                        <AIButton
                            variant="contained"
                            startIcon={<AutoFixHighIcon />}
                        >
                            AI Suggestions
                        </AIButton>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconButton
                                color="error"
                                onClick={() => handleCancel(isEditing, index)}
                                title={isEditing ? "Delete" : "Cancel"}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={addLanguage}
                            >
                                Finish
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        );
    };

    const renderLanguageDisplay = (languageObj, index) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography fontWeight="medium">
                    {languageObj.language || "Untitled Language"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Level: {getLanguageLevelDisplayText(languageObj.level)}
                </Typography>
            </Box>
            <IconButton
                color="primary"
                onClick={() => {
                    setEditingLanguageIndex(index);
                    setCurrentLanguage({ ...languageObj });
                }}
                title="Edit"
            >
                <EditIcon />
            </IconButton>
        </Box>
    );

    return (
        <Stack spacing={2}>
            {/* Existing languages */}
            {cvData.languages.map((languageObj, index) => (
                <Paper key={languageObj.id || index} variant="outlined" sx={{ p: 2 }}>
                    {editingLanguageIndex === index ? (
                        renderLanguageForm(true, index)
                    ) : (
                        renderLanguageDisplay(languageObj, index)
                    )}
                </Paper>
            ))}

            {/* Add new language form */}
            <Collapse in={showLanguageForm && editingLanguageIndex === null}>
                {renderLanguageForm()}
            </Collapse>

            {/* Add button and AI Suggestions */}
            {!showLanguageForm && editingLanguageIndex === null && (
                <Stack direction="row" spacing={2}>
                    <AddButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setShowLanguageForm(true)}
                    >
                        Add a Language
                    </AddButton>
                    <AIButton
                        variant="contained"
                        startIcon={<AutoFixHighIcon />}
                    >
                        AI Suggestions
                    </AIButton>
                </Stack>
            )}
        </Stack>
    );
};

export default LanguagesSection;