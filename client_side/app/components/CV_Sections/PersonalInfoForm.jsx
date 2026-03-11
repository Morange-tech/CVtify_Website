import React from 'react';
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Paper,
    Grid,
    Stack,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Chip,
    styled
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoUploader from '../PhotoUploader';

// Styled components
const AddFieldButton = styled(Button)(({ theme }) => ({
    borderStyle: 'dashed',
    borderColor: theme.palette.grey[300],
    justifyContent: 'flex-start',
    textTransform: 'none',
    padding: theme.spacing(1, 2),
    minHeight: 36,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const FormContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius * 2,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.grey[100],
    },
}));

const PersonalInfoForm = ({ 
    cvData, 
    setCvData, 
    openFields, 
    setOpenFields, 
    pendingDeleteField, 
    setPendingDeleteField 
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [activeField, setActiveField] = React.useState(null);

    const handleOpenField = (fieldId) => {
        if (!openFields.includes(fieldId)) {
            setOpenFields((prev) => [...prev, fieldId]);
        }
    };

    const handleCloseField = (fieldId) => {
        setOpenFields((prev) => prev.filter((id) => id !== fieldId));
        // Also clear the field value from cvData
        setCvData((prev) => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [fieldId]: "",
            },
        }));
    };

    // Handler for profile image changes
    const handleProfileImageChange = (imageData) => {
        setCvData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                profileImage: imageData
            }
        }));
    };

    // Handle menu open
    const handleMenuOpen = (event, field) => {
        setAnchorEl(event.currentTarget);
        setActiveField(field);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveField(null);
    };

    // Handle delete from menu
    const handleDeleteFromMenu = () => {
        if (activeField) {
            handleCloseField(activeField);
        }
        handleMenuClose();
    };

    // Helper to update personal info
    const updatePersonalInfo = (field, value) => {
        setCvData((prev) => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value,
            },
        }));
    };

    // Format field name for display
    const formatFieldName = (field) => {
        return field.charAt(0).toUpperCase() + field.slice(1);
    };

    // Primary fields (first row)
    const primaryAddFields = ["birth Date", "place Of Birth", "driving License"];
    
    // Secondary fields (second row)
    const secondaryAddFields = ["sex", "nationality", "marital Status", "website", "linkedIn"];

    return (
        <FormContainer elevation={0}>
            <Grid container spacing={3}>
                {/* Photo Uploader Section */}
                <Grid item xs={12} md={4}>
                    <PhotoUploader
                        profileImage={cvData.personalInfo.profileImage}
                        onProfileImageChange={handleProfileImageChange}
                    />
                </Grid>

                {/* Name and Title Section */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                fullWidth
                                label="First Name"
                                value={cvData.personalInfo.firstName || ""}
                                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                fullWidth
                                label="Last Name"
                                value={cvData.personalInfo.lastName || ""}
                                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField
                                fullWidth
                                label="Searched Job"
                                value={cvData.personalInfo.title || ""}
                                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Email and Phone Section */}
                <Grid item xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="E-mail"
                        type="email"
                        value={cvData.personalInfo.email || ""}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="Phone Number"
                        type="tel"
                        value={cvData.personalInfo.phoneNumber || ""}
                        onChange={(e) => updatePersonalInfo('phoneNumber', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                {/* Address Section */}
                <Grid item xs={12}>
                    <StyledTextField
                        fullWidth
                        label="Address"
                        value={cvData.personalInfo.address || ""}
                        onChange={(e) => updatePersonalInfo('address', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                {/* Postal Code and City Section */}
                <Grid item xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="Postal Code"
                        value={cvData.personalInfo.postalCode || ""}
                        onChange={(e) => updatePersonalInfo('postalCode', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="City"
                        value={cvData.personalInfo.city || ""}
                        onChange={(e) => updatePersonalInfo('city', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                {/* Dynamic Fields */}
                {openFields.map((field) => {
                    const isBirthDate = field.toLowerCase() === "birth date";
                    const inputType = isBirthDate ? "date" : "text";

                    return (
                        <Grid item xs={12} key={field}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <StyledTextField
                                    fullWidth
                                    label={formatFieldName(field)}
                                    type={inputType}
                                    value={cvData.personalInfo[field] || ""}
                                    onChange={(e) => updatePersonalInfo(field, e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={isBirthDate ? { shrink: true } : undefined}
                                    placeholder={isBirthDate ? "dd/mm/yyyy" : `Enter ${formatFieldName(field)}`}
                                />
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, field)}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    );
                })}

                {/* Add Field Buttons Section */}
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        {/* Primary Add Fields Row */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1 
                        }}>
                            {primaryAddFields.map((field) => (
                                !openFields.includes(field) && (
                                    <AddFieldButton
                                        key={field}
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenField(field)}
                                        size="small"
                                    >
                                        {formatFieldName(field)}
                                    </AddFieldButton>
                                )
                            ))}
                        </Box>

                        {/* Secondary Add Fields Row */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1 
                        }}>
                            {secondaryAddFields.map((field) => (
                                !openFields.includes(field) && (
                                    <AddFieldButton
                                        key={field}
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenField(field)}
                                        size="small"
                                    >
                                        {formatFieldName(field)}
                                    </AddFieldButton>
                                )
                            ))}
                        </Box>

                        {/* Personalised Field Button */}
                        <Box>
                            <AddFieldButton
                                variant="outlined"
                                startIcon={<AddIcon />}
                                size="small"
                            >
                                Personalised Field
                            </AddFieldButton>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

            {/* Delete Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleDeleteFromMenu} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </FormContainer>
    );
};

export default PersonalInfoForm;