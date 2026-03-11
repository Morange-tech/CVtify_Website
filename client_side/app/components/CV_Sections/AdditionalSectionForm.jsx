import React, { useRef } from 'react';
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
    Chip,
    LinearProgress,
    Card,
    CardContent,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DrawIcon from '@mui/icons-material/Draw';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const ReactQuill = dynamic(
    () => import("react-quill-new"),
    { ssr: false }
);

// Styled components
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const SignatureCanvas = styled('canvas')(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'crosshair',
    touchAction: 'none',
    backgroundColor: '#fff',
}));

const UploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const SkillLevelButton = styled(Button)(({ theme, selected }) => ({
    flex: 1,
    padding: theme.spacing(1),
    fontSize: '0.75rem',
    ...(selected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
}));

const AdditionalSectionForm = ({
    sectionId,
    currentAdditionalSection,
    setCurrentAdditionalSection,
    editingAdditionalIndex,
    signatureMode,
    setSignatureMode,
    isDrawing,
    setIsDrawing,
    signatureData,
    setSignatureData,
    handleFileUpload,
    handleTypedSignature,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
    quillModules,
    quillFormats
}) => {
    const localCanvasRef = useRef(null);
    const canvasRef = localCanvasRef;

    // Month options for select
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    // Year options
    const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

    // Skill levels
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

    const getSkillLevelProgress = (level) => {
        switch (level) {
            case 'beginner': return 25;
            case 'intermediate': return 50;
            case 'advanced': return 75;
            case 'expert': return 100;
            default: return 0;
        }
    };

    const getSkillLevelColor = (level) => {
        switch (level) {
            case 'beginner': return 'success';
            case 'intermediate': return 'info';
            case 'advanced': return 'secondary';
            case 'expert': return 'error';
            default: return 'inherit';
        }
    };

    // Get default fields based on section type
    const getDefaultFields = (sectionId) => {
        const fieldConfig = {
            courses: {
                course: "",
                month: "",
                year: "",
                isPresent: false,
                description: ""
            },
            internships: {
                position: "",
                employer: "",
                city: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isPresent: false,
                description: ""
            },
            extracurricular: {
                position: "",
                employer: "",
                city: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isPresent: false,
                description: ""
            },
            references: {
                name: "",
                company: "",
                city: "",
                phone: "",
                email: ""
            },
            qualities: { quality: "" },
            certificates: {
                certificate: "",
                month: "",
                year: "",
                isPresent: false,
                description: ""
            },
            achievements: { description: "" },
            signature: {
                city: "",
                date: "",
                signature: "",
                signatureType: "draw"
            },
            footer: { description: "" },
            custom: {
                type: 'description',
                description: "",
                entries: [],
                skills: [],
                list: []
            }
        };
        return fieldConfig[sectionId] || {};
    };

    // Render fields based on section type
    const renderFields = () => {
        const specificFields = {
            courses: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Course"
                                value={currentAdditionalSection.course || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, course: e.target.value }))}
                                placeholder="Course name"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Period</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentAdditionalSection.isPresent || false}
                                            onChange={() => setCurrentAdditionalSection(prev => ({
                                                ...prev,
                                                isPresent: !prev.isPresent
                                            }))}
                                            color="success"
                                            size="small"
                                        />
                                    }
                                    label="Present"
                                    labelPlacement="start"
                                />
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.month || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, month: e.target.value }))}
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
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.year || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, year: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                        <ReactQuill
                            theme="snow"
                            value={currentAdditionalSection.description || ""}
                            onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter description"
                        />
                    </Box>
                </>
            ),
            internships: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Position"
                                value={currentAdditionalSection.position || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, position: e.target.value }))}
                                placeholder="Position"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Employer"
                                value={currentAdditionalSection.employer || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, employer: e.target.value }))}
                                placeholder="Employer name"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={currentAdditionalSection.city || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="City"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Start Date</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.startMonth || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, startMonth: e.target.value }))}
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
                                            value={currentAdditionalSection.startYear || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, startYear: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">End Date</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentAdditionalSection.isPresent || false}
                                            onChange={() => setCurrentAdditionalSection(prev => ({
                                                ...prev,
                                                isPresent: !prev.isPresent
                                            }))}
                                            color="success"
                                            size="small"
                                        />
                                    }
                                    label="Present"
                                    labelPlacement="start"
                                />
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.endMonth || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, endMonth: e.target.value }))}
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
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.endYear || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, endYear: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                        <ReactQuill
                            theme="snow"
                            value={currentAdditionalSection.description || ""}
                            onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter description"
                        />
                    </Box>
                </>
            ),
            extracurricular: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Position"
                                value={currentAdditionalSection.position || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, position: e.target.value }))}
                                placeholder="Position"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Employer"
                                value={currentAdditionalSection.employer || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, employer: e.target.value }))}
                                placeholder="Employer"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={currentAdditionalSection.city || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="City"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Start Date</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.startMonth || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, startMonth: e.target.value }))}
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
                                            value={currentAdditionalSection.startYear || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, startYear: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">End Date</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentAdditionalSection.isPresent || false}
                                            onChange={() => setCurrentAdditionalSection(prev => ({
                                                ...prev,
                                                isPresent: !prev.isPresent
                                            }))}
                                            color="success"
                                            size="small"
                                        />
                                    }
                                    label="Present"
                                    labelPlacement="start"
                                />
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.endMonth || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, endMonth: e.target.value }))}
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
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.endYear || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, endYear: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                        <ReactQuill
                            theme="snow"
                            value={currentAdditionalSection.description || ""}
                            onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter description"
                        />
                    </Box>
                </>
            ),
            references: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={currentAdditionalSection.name || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Reference name"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={currentAdditionalSection.company || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, company: e.target.value }))}
                                placeholder="Company name"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={currentAdditionalSection.city || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="City"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Telephone Number"
                                type="tel"
                                value={currentAdditionalSection.phone || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Phone number"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={currentAdditionalSection.email || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Email address"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </>
            ),
            qualities: (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Quality"
                            value={currentAdditionalSection.quality || ""}
                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, quality: e.target.value }))}
                            placeholder="Enter a quality"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                </Grid>
            ),
            certificates: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Certificate"
                                value={currentAdditionalSection.certificate || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, certificate: e.target.value }))}
                                placeholder="Certificate name"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Period</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentAdditionalSection.isPresent || false}
                                            onChange={() => setCurrentAdditionalSection(prev => ({
                                                ...prev,
                                                isPresent: !prev.isPresent
                                            }))}
                                            color="success"
                                            size="small"
                                        />
                                    }
                                    label="Present"
                                    labelPlacement="start"
                                />
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Month</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.month || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, month: e.target.value }))}
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
                                    <FormControl fullWidth size="small" disabled={currentAdditionalSection.isPresent}>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={currentAdditionalSection.year || ""}
                                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, year: e.target.value }))}
                                            label="Year"
                                        >
                                            <MenuItem value="">Year</MenuItem>
                                            {years.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                        <ReactQuill
                            theme="snow"
                            value={currentAdditionalSection.description || ""}
                            onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter certificate description"
                        />
                    </Box>
                </>
            ),
            achievements: (
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Achievement Description</Typography>
                    <ReactQuill
                        theme="snow"
                        value={currentAdditionalSection.description || ""}
                        onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe your achievement"
                    />
                </Box>
            ),
            signature: (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={currentAdditionalSection.city || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="Enter city"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={currentAdditionalSection.date || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, date: e.target.value }))}
                                variant="outlined"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Signature</Typography>

                        {/* Show existing signature preview when editing */}
                        {editingAdditionalIndex !== null && currentAdditionalSection.signature && (
                            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Current Signature:</Typography>
                                {currentAdditionalSection.signatureType === 'type' ? (
                                    <Typography
                                        sx={{
                                            fontSize: '1.125rem',
                                            fontFamily: 'cursive',
                                            borderBottom: 2,
                                            borderColor: 'grey.800',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {currentAdditionalSection.signature}
                                    </Typography>
                                ) : (
                                    <Box
                                        component="img"
                                        src={currentAdditionalSection.signature}
                                        alt="Current signature"
                                        sx={{ height: 64, maxWidth: '100%', objectFit: 'contain', mx: 'auto', display: 'block' }}
                                    />
                                )}
                            </Paper>
                        )}

                        {/* Signature Mode Selection */}
                        <ToggleButtonGroup
                            value={signatureMode}
                            exclusive
                            onChange={(e, newMode) => newMode && setSignatureMode(newMode)}
                            sx={{ mb: 3 }}
                        >
                            <ToggleButton value="draw">
                                <DrawIcon sx={{ mr: 1 }} />
                                Draw
                            </ToggleButton>
                            <ToggleButton value="type">
                                <KeyboardIcon sx={{ mr: 1 }} />
                                Type
                            </ToggleButton>
                            <ToggleButton value="upload">
                                <UploadFileIcon sx={{ mr: 1 }} />
                                Upload
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {/* Drawing Canvas */}
                        {signatureMode === 'draw' && (
                            <Paper variant="outlined" sx={{ p: 3, bgcolor: 'white' }}>
                                <Stack spacing={2} alignItems="center">
                                    <SignatureCanvas
                                        ref={canvasRef}
                                        width={400}
                                        height={200}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={(e) => {
                                            e.preventDefault();
                                            startDrawing(e.touches[0]);
                                        }}
                                        onTouchMove={(e) => {
                                            e.preventDefault();
                                            draw(e.touches[0]);
                                        }}
                                        onTouchEnd={stopDrawing}
                                    />
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={clearCanvas}
                                        >
                                            Clear
                                        </Button>
                                        <Typography variant="body2" color="text.secondary">
                                            {editingAdditionalIndex !== null && currentAdditionalSection.signatureType === 'draw'
                                                ? "Edit your signature above (clear first if needed)"
                                                : "Draw your signature above"}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        )}

                        {/* Type Signature */}
                        {signatureMode === 'type' && (
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    value={currentAdditionalSection.signatureType === 'type' ? currentAdditionalSection.signature || "" : ""}
                                    onChange={handleTypedSignature}
                                    placeholder="Type your signature here"
                                    variant="outlined"
                                    InputProps={{
                                        sx: { fontFamily: 'cursive', fontSize: '1.125rem' }
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Preview:{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            fontFamily: 'cursive',
                                            fontSize: '1.125rem',
                                            borderBottom: 2,
                                            borderColor: 'grey.800'
                                        }}
                                    >
                                        {currentAdditionalSection.signatureType === 'type'
                                            ? currentAdditionalSection.signature || "Your signature will appear here"
                                            : "Your signature will appear here"}
                                    </Box>
                                </Typography>
                            </Stack>
                        )}

                        {/* Upload Signature */}
                        {signatureMode === 'upload' && (
                            <Stack spacing={3}>
                                <UploadBox>
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        id="signature-upload"
                                    />
                                    <label htmlFor="signature-upload" style={{ cursor: 'pointer' }}>
                                        <Stack alignItems="center" spacing={1}>
                                            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Click to upload signature image
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                PNG, JPG, GIF up to 5MB
                                            </Typography>
                                        </Stack>
                                    </label>
                                </UploadBox>
                                {(currentAdditionalSection.signature && currentAdditionalSection.signatureType === 'upload') && (
                                    <Box textAlign="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Current Uploaded Signature:
                                        </Typography>
                                        <Box
                                            component="img"
                                            src={currentAdditionalSection.signature}
                                            alt="Uploaded signature"
                                            sx={{ height: 80, border: 1, borderColor: 'grey.300', borderRadius: 1 }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        )}
                    </Box>
                </>
            ),
            footer: (
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Content</Typography>
                    <ReactQuill
                        theme="snow"
                        value={currentAdditionalSection.description || ""}
                        onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe your achievement"
                    />
                </Box>
            ),
            custom: (
                <>
                    {/* Type Selection Dropdown */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Section Type</InputLabel>
                        <Select
                            value={currentAdditionalSection.type || "description"}
                            onChange={(e) => setCurrentAdditionalSection(prev => ({
                                ...prev,
                                type: e.target.value,
                                description: "",
                                entries: [],
                                skills: [],
                                list: []
                            }))}
                            label="Section Type"
                        >
                            <MenuItem value="description">Description</MenuItem>
                            <MenuItem value="entries">Entries</MenuItem>
                            <MenuItem value="skills">Skills</MenuItem>
                            <MenuItem value="list">List</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Conditional Fields Based on Type */}
                    {currentAdditionalSection.type === 'description' && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                            <ReactQuill
                                theme="snow"
                                value={currentAdditionalSection.description || ""}
                                onChange={(value) => setCurrentAdditionalSection(prev => ({
                                    ...prev,
                                    description: value
                                }))}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter description"
                            />
                        </Box>
                    )}

                    {currentAdditionalSection.type === 'entries' && (
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={currentAdditionalSection.entryTitle || ""}
                                        onChange={(e) => setCurrentAdditionalSection(prev => ({
                                            ...prev,
                                            entryTitle: e.target.value
                                        }))}
                                        placeholder="title"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Summary"
                                        value={currentAdditionalSection.organization || ""}
                                        onChange={(e) => setCurrentAdditionalSection(prev => ({
                                            ...prev,
                                            organization: e.target.value
                                        }))}
                                        placeholder="summary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="month"
                                        value={currentAdditionalSection.startDate || ""}
                                        onChange={(e) => setCurrentAdditionalSection(prev => ({
                                            ...prev,
                                            startDate: e.target.value
                                        }))}
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="End Date"
                                        type="month"
                                        value={currentAdditionalSection.endDate || ""}
                                        onChange={(e) => setCurrentAdditionalSection(prev => ({
                                            ...prev,
                                            endDate: e.target.value
                                        }))}
                                        placeholder="Present if ongoing"
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                                <ReactQuill
                                    theme="snow"
                                    value={currentAdditionalSection.entryDescription || ""}
                                    onChange={(value) => setCurrentAdditionalSection(prev => ({
                                        ...prev,
                                        entryDescription: value
                                    }))}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter description"
                                />
                            </Box>

                            <Button
                                variant="contained"
                                onClick={() => {
                                    const newEntry = {
                                        id: Date.now(),
                                        title: currentAdditionalSection.entryTitle,
                                        summary: currentAdditionalSection.organization,
                                        startDate: currentAdditionalSection.startDate,
                                        endDate: currentAdditionalSection.endDate,
                                        description: currentAdditionalSection.entryDescription
                                    };

                                    setCurrentAdditionalSection(prev => ({
                                        ...prev,
                                        entries: [...(prev.entries || []), newEntry],
                                        entryTitle: "",
                                        organization: "",
                                        startDate: "",
                                        endDate: "",
                                        entryDescription: ""
                                    }));
                                }}
                                disabled={!currentAdditionalSection.entryTitle}
                            >
                                Add Entry
                            </Button>

                            {/* Display added entries */}
                            {currentAdditionalSection.entries && currentAdditionalSection.entries.length > 0 && (
                                <Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Added Entries:</Typography>
                                    <Stack spacing={1}>
                                        {currentAdditionalSection.entries.map((entry, index) => (
                                            <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography fontWeight="medium">{entry.title} - {entry.summary}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {entry.startDate} to {entry.endDate || 'Present'}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            const updatedEntries = currentAdditionalSection.entries.filter((_, i) => i !== index);
                                                            setCurrentAdditionalSection(prev => ({
                                                                ...prev,
                                                                entries: updatedEntries
                                                            }));
                                                        }}
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {currentAdditionalSection.type === 'skills' && (
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Skill"
                                        value={currentAdditionalSection.skillName || ""}
                                        onChange={(e) => setCurrentAdditionalSection(prev => ({
                                            ...prev,
                                            skillName: e.target.value
                                        }))}
                                        placeholder="Skill name"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Level:{' '}
                                        <Box component="span" sx={{ color: 'primary.main', textTransform: 'capitalize' }}>
                                            {currentAdditionalSection.skillLevel || "Not selected"}
                                        </Box>
                                    </Typography>

                                    {/* Level Selection Bar */}
                                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                        {skillLevels.map((level) => (
                                            <SkillLevelButton
                                                key={level}
                                                variant={currentAdditionalSection.skillLevel === level ? "contained" : "outlined"}
                                                selected={currentAdditionalSection.skillLevel === level}
                                                onClick={() => setCurrentAdditionalSection(prev => ({
                                                    ...prev,
                                                    skillLevel: level
                                                }))}
                                                size="small"
                                            >
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </SkillLevelButton>
                                        ))}
                                    </Stack>

                                    {/* Visual Indicator Bar */}
                                    <LinearProgress
                                        variant="determinate"
                                        value={getSkillLevelProgress(currentAdditionalSection.skillLevel)}
                                        color={getSkillLevelColor(currentAdditionalSection.skillLevel)}
                                        sx={{ height: 10, borderRadius: 5 }}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                onClick={() => {
                                    const newSkill = {
                                        id: Date.now(),
                                        name: currentAdditionalSection.skillName,
                                        level: currentAdditionalSection.skillLevel
                                    };

                                    setCurrentAdditionalSection(prev => ({
                                        ...prev,
                                        skills: [...(prev.skills || []), newSkill],
                                        skillName: "",
                                        skillLevel: ""
                                    }));
                                }}
                                disabled={!currentAdditionalSection.skillName}
                            >
                                Add Skill
                            </Button>

                            {/* Display added skills */}
                            {currentAdditionalSection.skills && currentAdditionalSection.skills.length > 0 && (
                                <Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Added Skills:</Typography>
                                    <Stack spacing={1}>
                                        {currentAdditionalSection.skills.map((skill, index) => (
                                            <Paper key={skill.id} variant="outlined" sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography fontWeight="medium">{skill.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Level: {skill.level}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            const updatedSkills = currentAdditionalSection.skills.filter((_, i) => i !== index);
                                                            setCurrentAdditionalSection(prev => ({
                                                                ...prev,
                                                                skills: updatedSkills
                                                            }));
                                                        }}
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {currentAdditionalSection.type === 'list' && (
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={currentAdditionalSection.listItem || ""}
                                onChange={(e) => setCurrentAdditionalSection(prev => ({
                                    ...prev,
                                    listItem: e.target.value
                                }))}
                                placeholder="title"
                                variant="outlined"
                                size="small"
                            />

                            <Button
                                variant="contained"
                                onClick={() => {
                                    const newItem = {
                                        id: Date.now(),
                                        text: currentAdditionalSection.listItem
                                    };

                                    setCurrentAdditionalSection(prev => ({
                                        ...prev,
                                        list: [...(prev.list || []), newItem],
                                        listItem: ""
                                    }));
                                }}
                                disabled={!currentAdditionalSection.listItem}
                            >
                                Add to List
                            </Button>

                            {/* Display list items */}
                            {currentAdditionalSection.list && currentAdditionalSection.list.length > 0 && (
                                <Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>List Items:</Typography>
                                    <Stack spacing={1}>
                                        {currentAdditionalSection.list.map((item, index) => (
                                            <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography>{item.text}</Typography>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            const updatedList = currentAdditionalSection.list.filter((_, i) => i !== index);
                                                            setCurrentAdditionalSection(prev => ({
                                                                ...prev,
                                                                list: updatedList
                                                            }));
                                                        }}
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    )}
                </>
            ),
        };

        return (
            <Box>
                {specificFields[sectionId] || (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={currentAdditionalSection.title || ""}
                            onChange={(e) => setCurrentAdditionalSection(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter title"
                            variant="outlined"
                            size="small"
                        />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Description</Typography>
                            <ReactQuill
                                theme="snow"
                                value={currentAdditionalSection.description || ""}
                                onChange={(value) => setCurrentAdditionalSection(prev => ({ ...prev, description: value }))}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter description"
                            />
                        </Box>
                    </Stack>
                )}
            </Box>
        );
    };

    return (
        <Box>
            {renderFields()}
        </Box>
    );
};

export default AdditionalSectionForm;