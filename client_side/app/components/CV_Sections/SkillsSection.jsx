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
    textTransform: 'none',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const AIButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    '& .MuiButton-startIcon': {
        transition: 'transform 0.3s ease',
    },
    '&:hover .MuiButton-startIcon': {
        transform: 'rotate(180deg)',
    },
}));

const SkillsSection = ({ cvData, setCvData }) => {
    const [currentSkill, setCurrentSkill] = useState({ skill: "", level: "" });
    const [editingSkillIndex, setEditingSkillIndex] = useState(null);
    const [showSkillForm, setShowSkillForm] = useState(true);

    // Skill level options
    const skillLevels = [
        { value: "01", label: "Beginner" },
        { value: "02", label: "Intermediate" },
        { value: "03", label: "Good" },
        { value: "04", label: "Very Good" },
        { value: "05", label: "Excellent" }
    ];

    const getLevelDisplayText = (levelCode) => {
        const level = skillLevels.find(l => l.value === levelCode);
        return level ? level.label : levelCode || "Not specified";
    };

    const addSkill = () => {
        if (!currentSkill.skill || !currentSkill.level) {
            alert("Please fill in all fields.");
            return;
        }

        const skillToAdd = {
            ...currentSkill,
            skill: String(currentSkill.skill),
            level: String(currentSkill.level)
        };

        if (editingSkillIndex !== null) {
            setCvData(prev => {
                const updatedSkills = [...prev.skills];
                updatedSkills[editingSkillIndex] = skillToAdd;
                return { ...prev, skills: updatedSkills };
            });
            setEditingSkillIndex(null);
        } else {
            setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, { ...skillToAdd, id: Date.now() }]
            }));
            setShowSkillForm(false);
        }

        setCurrentSkill({
            skill: "",
            level: "",
        });
    };

    const removeSkill = (index) => {
        setCvData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = (isEditing, index) => {
        if (isEditing) {
            removeSkill(index);
            setEditingSkillIndex(null);
        }
        setCurrentSkill({
            skill: "",
            level: "",
        });
        setShowSkillForm(false);
    };

    const renderSkillForm = (isEditing = false, index = null) => {
        return (
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* Skill and Level Inputs */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Skill"
                                value={currentSkill.skill || ""}
                                onChange={(e) => setCurrentSkill(prev => ({ ...prev, skill: e.target.value }))}
                                placeholder="e.g., JavaScript, Project Management, Design"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Level</InputLabel>
                                <Select
                                    value={currentSkill.level || ""}
                                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, level: e.target.value }))}
                                    label="Level"
                                >
                                    <MenuItem value="">
                                        <em>Choose</em>
                                    </MenuItem>
                                    {skillLevels.map(level => (
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
                                onClick={addSkill}
                            >
                                Finish
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        );
    };

    const renderSkillDisplay = (skillObj, index) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography fontWeight="medium">
                    {skillObj.skill || "Untitled Skill"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Level: {getLevelDisplayText(skillObj.level)}
                </Typography>
            </Box>
            <IconButton
                color="primary"
                onClick={() => {
                    setEditingSkillIndex(index);
                    setCurrentSkill({ ...skillObj });
                }}
                title="Edit"
            >
                <EditIcon />
            </IconButton>
        </Box>
    );

    return (
        <Stack spacing={2}>
            {/* Existing skills */}
            {cvData.skills.map((skillObj, index) => (
                <Paper key={skillObj.id || index} variant="outlined" sx={{ p: 2 }}>
                    {editingSkillIndex === index ? (
                        renderSkillForm(true, index)
                    ) : (
                        renderSkillDisplay(skillObj, index)
                    )}
                </Paper>
            ))}

            {/* Add new skill form */}
            <Collapse in={showSkillForm && editingSkillIndex === null}>
                {renderSkillForm()}
            </Collapse>

            {/* Add button and AI Suggestions */}
            {!showSkillForm && editingSkillIndex === null && (
                <Stack direction="row" spacing={2}>
                    <AddButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setShowSkillForm(true)}
                    >
                        Add Skill
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

export default SkillsSection;