import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
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

const InterestsSection = ({ cvData, setCvData }) => {
    const [currentInterest, setCurrentInterest] = useState({ interest: "" });
    const [editingInterestIndex, setEditingInterestIndex] = useState(null);
    const [showInterestForm, setShowInterestForm] = useState(true);

    const addInterest = () => {
        if (!currentInterest.interest) {
            alert("Please fill in the interest field.");
            return;
        }

        const interestToAdd = {
            ...currentInterest,
            interest: String(currentInterest.interest || "")
        };

        if (editingInterestIndex !== null) {
            setCvData(prev => {
                const updatedInterests = [...prev.interests];
                updatedInterests[editingInterestIndex] = interestToAdd;
                return { ...prev, interests: updatedInterests };
            });
            setEditingInterestIndex(null);
        } else {
            setCvData(prev => ({
                ...prev,
                interests: [...prev.interests, { ...interestToAdd, id: Date.now() }]
            }));
            setShowInterestForm(false);
        }

        setCurrentInterest({
            interest: "",
        });
    };

    const removeInterest = (index) => {
        setCvData(prev => ({
            ...prev,
            interests: prev.interests.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = (isEditing, index) => {
        if (isEditing) {
            removeInterest(index);
            setEditingInterestIndex(null);
        }
        setCurrentInterest({
            interest: "",
        });
        setShowInterestForm(false);
    };

    const renderInterestForm = (isEditing = false, index = null) => {
        return (
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* Interest Input */}
                    <TextField
                        fullWidth
                        label="Interest"
                        value={currentInterest.interest || ""}
                        onChange={(e) => setCurrentInterest(prev => ({ ...prev, interest: e.target.value }))}
                        placeholder="e.g., Photography, Traveling, Reading"
                        variant="outlined"
                        size="small"
                    />

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
                                onClick={addInterest}
                            >
                                Finish
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        );
    };

    const renderInterestDisplay = (interestObj, index) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontWeight="medium">
                {interestObj.interest || "Untitled Interest"}
            </Typography>
            <IconButton
                color="primary"
                onClick={() => {
                    setEditingInterestIndex(index);
                    setCurrentInterest({ ...interestObj });
                }}
                title="Edit"
            >
                <EditIcon />
            </IconButton>
        </Box>
    );

    return (
        <Stack spacing={2}>
            {/* Existing interests */}
            {cvData.interests.map((interestObj, index) => (
                <Paper key={interestObj.id || index} variant="outlined" sx={{ p: 2 }}>
                    {editingInterestIndex === index ? (
                        renderInterestForm(true, index)
                    ) : (
                        renderInterestDisplay(interestObj, index)
                    )}
                </Paper>
            ))}

            {/* Add new interest form */}
            <Collapse in={showInterestForm && editingInterestIndex === null}>
                {renderInterestForm()}
            </Collapse>

            {/* Add button and AI Suggestions */}
            {!showInterestForm && editingInterestIndex === null && (
                <Stack direction="row" spacing={2}>
                    <AddButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setShowInterestForm(true)}
                    >
                        Add an Interest
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

export default InterestsSection;