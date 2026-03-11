'use client';

import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    Select,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BrushIcon from '@mui/icons-material/Brush';
import StarIcon from '@mui/icons-material/Star';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// ─── Category Config ───
const CATEGORIES = [
    { value: 'professional', label: 'Professional', color: '#667eea', icon: '💼' },
    { value: 'creative', label: 'Creative', color: '#ec4899', icon: '🎨' },
    { value: 'executive', label: 'Executive', color: '#8b5cf6', icon: '👔' },
    { value: 'ats-optimized', label: 'ATS-Optimized', color: '#10b981', icon: '🎯' },
    { value: 'simple', label: 'Simple / Minimal', color: '#06b6d4', icon: '✨' },
    { value: 'academic', label: 'Academic', color: '#f59e0b', icon: '🎓' },
];

const getCategoryConfig = (value) =>
    CATEGORIES.find((c) => c.value === value) || { label: value, color: '#64748b', icon: '📄' };

export default function AdminTemplatesPage() {
    // ─── State ───
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // Dialogs
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'professional',
        isPremium: false,
        isPublished: true,
        description: '',
        previewImage: null,
        previewFileName: '',
    });

    const fileInputRef = useRef(null);

    // ─── Mock Templates Data ───
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: 'Professional',
            category: 'professional',
            isPremium: false,
            isPublished: true,
            previewImage: '/templates/template1.png',
            description: 'Clean and professional layout perfect for corporate roles.',
            uses: 3245,
            downloads: 5120,
            rating: 4.8,
            createdAt: '2025-01-10',
            updatedAt: '2025-06-15',
        },
        {
            id: 2,
            name: 'Executive',
            category: 'executive',
            isPremium: true,
            isPublished: true,
            previewImage: '/templates/template2.png',
            description: 'Elegant design for senior-level and executive positions.',
            uses: 1890,
            downloads: 3200,
            rating: 4.9,
            createdAt: '2025-01-15',
            updatedAt: '2025-06-12',
        },
        {
            id: 3,
            name: 'Tech Pro',
            category: 'professional',
            isPremium: true,
            isPublished: true,
            previewImage: '/templates/template3.png',
            description: 'Modern template tailored for tech professionals.',
            uses: 1650,
            downloads: 2800,
            rating: 4.8,
            createdAt: '2025-02-01',
            updatedAt: '2025-06-10',
        },
        {
            id: 4,
            name: 'Modern Creative',
            category: 'creative',
            isPremium: false,
            isPublished: true,
            previewImage: '/templates/template4.png',
            description: 'Bold and creative design for design and marketing roles.',
            uses: 2180,
            downloads: 4100,
            rating: 4.9,
            createdAt: '2025-02-10',
            updatedAt: '2025-06-08',
        },
        {
            id: 5,
            name: 'Minimal Clean',
            category: 'ats-optimized',
            isPremium: false,
            isPublished: true,
            previewImage: '/templates/template5.png',
            description: 'ATS-friendly minimal design that focuses on content.',
            uses: 1520,
            downloads: 2400,
            rating: 4.7,
            createdAt: '2025-03-01',
            updatedAt: '2025-06-05',
        },
        {
            id: 6,
            name: 'Fresh Graduate',
            category: 'simple',
            isPremium: false,
            isPublished: true,
            previewImage: '/templates/template6.png',
            description: 'Simple and clean layout perfect for entry-level candidates.',
            uses: 947,
            downloads: 1600,
            rating: 4.6,
            createdAt: '2025-03-15',
            updatedAt: '2025-06-01',
        },
        {
            id: 7,
            name: 'Academic Research',
            category: 'academic',
            isPremium: true,
            isPublished: false,
            previewImage: null,
            description: 'Designed for academic and research professionals.',
            uses: 0,
            downloads: 0,
            rating: 0,
            createdAt: '2025-06-18',
            updatedAt: '2025-06-18',
        },
    ]);

    // ─── Computed ───
    const totalTemplates = templates.length;
    const premiumTemplates = templates.filter((t) => t.isPremium).length;
    const freeTemplates = templates.filter((t) => !t.isPremium).length;
    const publishedTemplates = templates.filter((t) => t.isPublished).length;
    const unpublishedTemplates = templates.filter((t) => !t.isPublished).length;
    const totalUses = templates.reduce((acc, t) => acc + t.uses, 0);

    // ─── Filter ───
    const filteredTemplates = templates.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'premium' && t.isPremium) ||
            (activeTab === 'free' && !t.isPremium) ||
            (activeTab === 'unpublished' && !t.isPublished);
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

        return matchesSearch && matchesTab && matchesCategory;
    });

    // ─── Handlers ───
    const handleMenuOpen = (event, template) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedTemplate(template);
    };

    const handleMenuClose = () => setMenuAnchorEl(null);

    // Create
    const handleCreateOpen = () => {
        setFormData({
            name: '',
            category: 'professional',
            isPremium: false,
            isPublished: true,
            description: '',
            previewImage: null,
            previewFileName: '',
        });
        setCreateDialogOpen(true);
    };

    const handleCreateConfirm = () => {
        const newTemplate = {
            id: Date.now(),
            name: formData.name,
            category: formData.category,
            isPremium: formData.isPremium,
            isPublished: formData.isPublished,
            previewImage: formData.previewImage,
            description: formData.description,
            uses: 0,
            downloads: 0,
            rating: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };
        setTemplates((prev) => [newTemplate, ...prev]);
        setCreateDialogOpen(false);
        setSnackbar({ open: true, message: `Template "${formData.name}" created!`, severity: 'success' });
    };

    // Edit
    const handleEditOpen = (template) => {
        const t = template || selectedTemplate;
        setSelectedTemplate(t);
        setFormData({
            name: t.name,
            category: t.category,
            isPremium: t.isPremium,
            isPublished: t.isPublished,
            description: t.description,
            previewImage: t.previewImage,
            previewFileName: t.previewImage ? 'current-image.png' : '',
        });
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleEditConfirm = () => {
        setTemplates((prev) =>
            prev.map((t) =>
                t.id === selectedTemplate.id
                    ? {
                        ...t,
                        name: formData.name,
                        category: formData.category,
                        isPremium: formData.isPremium,
                        isPublished: formData.isPublished,
                        description: formData.description,
                        previewImage: formData.previewImage,
                        updatedAt: new Date().toISOString().split('T')[0],
                    }
                    : t
            )
        );
        setEditDialogOpen(false);
        setSnackbar({ open: true, message: `Template "${formData.name}" updated!`, severity: 'success' });
    };

    // Delete
    const handleDeleteOpen = (template) => {
        setSelectedTemplate(template || selectedTemplate);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = () => {
        setTemplates((prev) => prev.filter((t) => t.id !== selectedTemplate.id));
        setDeleteDialogOpen(false);
        setSnackbar({ open: true, message: `Template "${selectedTemplate.name}" deleted.`, severity: 'warning' });
    };

    // Toggle Premium/Free
    const handleTogglePremium = (template) => {
        const t = template || selectedTemplate;
        setTemplates((prev) =>
            prev.map((item) =>
                item.id === t.id ? { ...item, isPremium: !item.isPremium, updatedAt: new Date().toISOString().split('T')[0] } : item
            )
        );
        handleMenuClose();
        setSnackbar({
            open: true,
            message: `"${t.name}" set to ${t.isPremium ? 'Free' : 'Premium'}.`,
            severity: 'info',
        });
    };

    // Toggle Published
    const handleTogglePublished = (template) => {
        const t = template || selectedTemplate;
        setTemplates((prev) =>
            prev.map((item) =>
                item.id === t.id ? { ...item, isPublished: !item.isPublished, updatedAt: new Date().toISOString().split('T')[0] } : item
            )
        );
        handleMenuClose();
        setSnackbar({
            open: true,
            message: `"${t.name}" ${t.isPublished ? 'unpublished' : 'published'}.`,
            severity: 'info',
        });
    };

    // Preview
    const handlePreviewOpen = (template) => {
        setSelectedTemplate(template || selectedTemplate);
        setPreviewDialogOpen(true);
        handleMenuClose();
    };

    // File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData((prev) => ({
                    ...prev,
                    previewImage: event.target.result,
                    previewFileName: file.name,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, previewImage: null, previewFileName: '' }));
    };

    // ─── Template Form Component ───
    //   const TemplateForm = ({ isEdit = false }) => (
    //     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
    //       {/* Name */}
    //       <TextField
    //         fullWidth
    //         label="Template Name"
    //         placeholder="e.g. Modern Professional"
    //         value={formData.name}
    //         onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
    //         sx={{
    //           '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
    //           '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
    //         }}
    //       />

    //       {/* Category */}
    //       <FormControl fullWidth>
    //         <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Category</InputLabel>
    //         <Select
    //           value={formData.category}
    //           label="Category"
    //           onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
    //           sx={{
    //             borderRadius: 2,
    //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
    //           }}
    //         >
    //           {CATEGORIES.map((cat) => (
    //             <MenuItem key={cat.value} value={cat.value}>
    //               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //                 <Typography fontSize="1rem">{cat.icon}</Typography>
    //                 <Typography variant="body2">{cat.label}</Typography>
    //               </Box>
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>

    //       {/* Description */}
    //       <TextField
    //         fullWidth
    //         label="Description"
    //         placeholder="Brief description of the template..."
    //         multiline
    //         rows={2}
    //         value={formData.description}
    //         onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
    //         sx={{
    //           '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
    //           '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
    //         }}
    //       />

    //       {/* Premium / Free Toggle */}
    //       <Box
    //         sx={{
    //           p: 2,
    //           borderRadius: 2,
    //           bgcolor: formData.isPremium ? '#8b5cf608' : '#10b98108',
    //           border: `1px solid ${formData.isPremium ? '#8b5cf620' : '#10b98120'}`,
    //         }}
    //       >
    //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //             {formData.isPremium ? (
    //               <WorkspacePremiumIcon sx={{ color: '#8b5cf6' }} />
    //             ) : (
    //               <LockOpenIcon sx={{ color: '#10b981' }} />
    //             )}
    //             <Box>
    //               <Typography variant="body2" fontWeight="600" color="#1e293b">
    //                 {formData.isPremium ? 'Premium Template' : 'Free Template'}
    //               </Typography>
    //               <Typography variant="caption" color="#94a3b8">
    //                 {formData.isPremium
    //                   ? 'Only premium users can access this template'
    //                   : 'Available to all users'}
    //               </Typography>
    //             </Box>
    //           </Box>
    //           <Switch
    //             checked={formData.isPremium}
    //             onChange={(e) => setFormData((prev) => ({ ...prev, isPremium: e.target.checked }))}
    //             sx={{
    //               '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' },
    //               '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' },
    //             }}
    //           />
    //         </Box>
    //       </Box>

    //       {/* Published Toggle */}
    //       <Box
    //         sx={{
    //           p: 2,
    //           borderRadius: 2,
    //           bgcolor: formData.isPublished ? '#667eea08' : '#f59e0b08',
    //           border: `1px solid ${formData.isPublished ? '#667eea20' : '#f59e0b20'}`,
    //         }}
    //       >
    //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //             {formData.isPublished ? (
    //               <PublicIcon sx={{ color: '#667eea' }} />
    //             ) : (
    //               <VisibilityOffIcon sx={{ color: '#f59e0b' }} />
    //             )}
    //             <Box>
    //               <Typography variant="body2" fontWeight="600" color="#1e293b">
    //                 {formData.isPublished ? 'Published' : 'Draft / Unpublished'}
    //               </Typography>
    //               <Typography variant="caption" color="#94a3b8">
    //                 {formData.isPublished
    //                   ? 'Visible to users on the templates page'
    //                   : 'Hidden from users until published'}
    //               </Typography>
    //             </Box>
    //           </Box>
    //           <Switch
    //             checked={formData.isPublished}
    //             onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
    //             sx={{
    //               '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
    //               '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#667eea' },
    //             }}
    //           />
    //         </Box>
    //       </Box>

    //       {/* Preview Image Upload */}
    //       <Box>
    //         <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
    //           Preview Image
    //         </Typography>

    //         {formData.previewImage ? (
    //           <Box
    //             sx={{
    //               position: 'relative',
    //               borderRadius: 2,
    //               border: '1px solid #e2e8f0',
    //               overflow: 'hidden',
    //             }}
    //           >
    //             <Box
    //               sx={{
    //                 height: 200,
    //                 bgcolor: '#f1f5f9',
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //               }}
    //             >
    //               {formData.previewImage.startsWith('data:') || formData.previewImage.startsWith('/') ? (
    //                 <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
    //                   <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
    //                   <Typography variant="caption" display="block">
    //                     {formData.previewFileName}
    //                   </Typography>
    //                 </Box>
    //               ) : (
    //                 <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
    //               )}
    //             </Box>

    //             <Box
    //               sx={{
    //                 display: 'flex',
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center',
    //                 p: 1.5,
    //                 bgcolor: '#f8fafc',
    //                 borderTop: '1px solid #e2e8f0',
    //               }}
    //             >
    //               <Typography variant="caption" color="#64748b" noWrap sx={{ flex: 1 }}>
    //                 {formData.previewFileName}
    //               </Typography>
    //               <Box sx={{ display: 'flex', gap: 0.5 }}>
    //                 <Button
    //                   size="small"
    //                   onClick={() => fileInputRef.current?.click()}
    //                   sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#667eea' }}
    //                 >
    //                   Replace
    //                 </Button>
    //                 <Button
    //                   size="small"
    //                   onClick={handleRemoveImage}
    //                   sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#ef4444' }}
    //                 >
    //                   Remove
    //                 </Button>
    //               </Box>
    //             </Box>
    //           </Box>
    //         ) : (
    //           <Box
    //             onClick={() => fileInputRef.current?.click()}
    //             sx={{
    //               height: 160,
    //               borderRadius: 2,
    //               border: '2px dashed #e2e8f0',
    //               display: 'flex',
    //               flexDirection: 'column',
    //               alignItems: 'center',
    //               justifyContent: 'center',
    //               cursor: 'pointer',
    //               transition: 'all 0.2s ease',
    //               '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08' },
    //             }}
    //           >
    //             <CloudUploadIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
    //             <Typography variant="body2" fontWeight="600" color="#64748b">
    //               Click to upload preview image
    //             </Typography>
    //             <Typography variant="caption" color="#94a3b8">
    //               PNG, JPG up to 5MB (recommended: 600x800px)
    //             </Typography>
    //           </Box>
    //         )}

    //         <input
    //           type="file"
    //           ref={fileInputRef}
    //           hidden
    //           accept="image/*"
    //           onChange={handleFileChange}
    //         />
    //       </Box>
    //     </Box>
    //   );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* ─── Header ─── */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="700" color="#1e293b">
                        🎨 Template Management
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Create, edit, and manage CV templates
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateOpen}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            '&:hover': { boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)' },
                        }}
                    >
                        Add Template
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
                            <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ─── Stats ─── */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
                    gap: 2,
                    mb: 4,
                }}
            >
                {[
                    { label: 'Total', value: totalTemplates, icon: <BrushIcon />, color: '#667eea' },
                    { label: 'Premium', value: premiumTemplates, icon: <WorkspacePremiumIcon />, color: '#8b5cf6' },
                    { label: 'Free', value: freeTemplates, icon: <LockOpenIcon />, color: '#10b981' },
                    { label: 'Published', value: publishedTemplates, icon: <PublicIcon />, color: '#06b6d4' },
                    { label: 'Unpublished', value: unpublishedTemplates, icon: <VisibilityOffIcon />, color: '#f59e0b' },
                    { label: 'Total Uses', value: totalUses.toLocaleString(), icon: <TrendingUpIcon />, color: '#ec4899' },
                ].map((stat, i) => (
                    <Box
                        key={i}
                        sx={{
                            bgcolor: '#ffffff', p: 2, borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                        }}
                    >
                        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, '& .MuiSvgIcon-root': { fontSize: 20 } }}>
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ lineHeight: 1.2 }}>{stat.value}</Typography>
                            <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* ─── Tabs ─── */}
            <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                sx={{
                    mb: 3,
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 40 },
                    '& .Mui-selected': { color: '#667eea' },
                    '& .MuiTabs-indicator': { backgroundColor: '#667eea' },
                }}
            >
                <Tab label={`All (${totalTemplates})`} value="all" />
                <Tab label={`Premium (${premiumTemplates})`} value="premium" />
                <Tab label={`Free (${freeTemplates})`} value="free" />
                <Tab label={`Unpublished (${unpublishedTemplates})`} value="unpublished" />
            </Tabs>

            {/* ─── Search, Filter, Sort ─── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search templates..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
                />

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Category</InputLabel>
                    <Select
                        value={categoryFilter}
                        label="Category"
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    size="small"
                    startIcon={<SortIcon />}
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                    sx={{ textTransform: 'none', color: '#64748b', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}
                >
                    Sort
                </Button>

                <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
                    {[
                        { label: 'Most Popular', value: 'popular' },
                        { label: 'Newest', value: 'newest' },
                        { label: 'Name (A-Z)', value: 'name' },
                        { label: 'Most Downloads', value: 'downloads' },
                        { label: 'Highest Rated', value: 'rating' },
                    ].map((opt) => (
                        <MenuItem key={opt.value} selected={sortBy === opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Menu>

                <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <IconButton size="small" onClick={() => setViewMode('grid')} sx={{ borderRadius: '8px 0 0 8px', bgcolor: viewMode === 'grid' ? '#667eea15' : 'transparent', color: viewMode === 'grid' ? '#667eea' : '#94a3b8' }}>
                        <GridViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setViewMode('list')} sx={{ borderRadius: '0 8px 8px 0', bgcolor: viewMode === 'list' ? '#667eea15' : 'transparent', color: viewMode === 'list' ? '#667eea' : '#94a3b8' }}>
                        <ViewListIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* ─── Templates Grid / List ─── */}
            {filteredTemplates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <BrushIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" fontWeight="600" color="#94a3b8">No templates found</Typography>
                    <Button startIcon={<AddIcon />} onClick={handleCreateOpen} sx={{ mt: 2, textTransform: 'none', color: '#667eea', fontWeight: 600 }}>
                        Add New Template
                    </Button>
                </Box>
            ) : viewMode === 'grid' ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                    {filteredTemplates.map((template) => {
                        const catConfig = getCategoryConfig(template.category);
                        return (
                            <Box
                                key={template.id}
                                sx={{
                                    bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    overflow: 'hidden', transition: 'all 0.3s ease',
                                    opacity: template.isPublished ? 1 : 0.7,
                                    border: template.isPublished ? '1px solid transparent' : '1px dashed #f59e0b',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
                                }}
                            >
                                {/* Preview */}
                                <Box
                                    sx={{
                                        height: 200, bgcolor: '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', cursor: 'pointer',
                                    }}
                                    onClick={() => template.previewImage && handlePreviewOpen(template)}
                                >
                                    {template.previewImage ? (
                                        <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                                            <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                                            <Typography variant="caption" display="block">Preview</Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <CloudUploadIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 0.5 }} />
                                            <Typography variant="caption" color="#94a3b8">No preview</Typography>
                                        </Box>
                                    )}

                                    {/* Badges */}
                                    <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Chip
                                            label={template.isPremium ? 'Premium' : 'Free'}
                                            size="small"
                                            sx={{
                                                fontWeight: 700, fontSize: '0.65rem', height: 22,
                                                bgcolor: template.isPremium ? '#8b5cf6' : '#10b981',
                                                color: '#ffffff',
                                            }}
                                        />
                                        {!template.isPublished && (
                                            <Chip label="Unpublished" size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, bgcolor: '#f59e0b', color: '#ffffff' }} />
                                        )}
                                    </Box>

                                    {/* Category */}
                                    <Chip
                                        label={`${catConfig.icon} ${catConfig.label}`}
                                        size="small"
                                        sx={{
                                            position: 'absolute', bottom: 10, left: 10,
                                            fontWeight: 600, fontSize: '0.65rem', height: 22,
                                            bgcolor: 'rgba(255,255,255,0.9)', color: catConfig.color,
                                            backdropFilter: 'blur(4px)',
                                        }}
                                    />
                                </Box>

                                {/* Info */}
                                <Box sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body1" fontWeight="700" color="#1e293b" noWrap>
                                                {template.name}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {template.description}
                                            </Typography>
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, template)}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Stats */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Tooltip title="Uses">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <PeopleIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    <Typography variant="caption" color="#94a3b8">{template.uses.toLocaleString()}</Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title="Downloads">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <DownloadIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    <Typography variant="caption" color="#94a3b8">{template.downloads.toLocaleString()}</Typography>
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                        {template.rating > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                                                <Typography variant="caption" fontWeight="600" color="#1e293b">{template.rating}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}

                    {/* Add New Card */}
                    <Box
                        onClick={handleCreateOpen}
                        sx={{
                            bgcolor: '#ffffff', borderRadius: 3, border: '2px dashed #e2e8f0',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            minHeight: 340, cursor: 'pointer', transition: 'all 0.3s ease',
                            '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08', transform: 'translateY(-4px)' },
                        }}
                    >
                        <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#667eea15', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <AddIcon sx={{ fontSize: 30, color: '#667eea' }} />
                        </Box>
                        <Typography variant="body1" fontWeight="600" color="#667eea">Add New Template</Typography>
                        <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5 }}>Upload a new CV template</Typography>
                    </Box>
                </Box>
            ) : (
                /* List View */
                <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 1fr auto', gap: 2, p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['TEMPLATE', 'CATEGORY', 'TYPE', 'STATUS', 'USES', 'RATING', 'ACTIONS'].map((h) => (
                            <Typography key={h} variant="caption" fontWeight="700" color="#64748b">{h}</Typography>
                        ))}
                    </Box>

                    {filteredTemplates.map((template, index) => {
                        const catConfig = getCategoryConfig(template.category);
                        return (
                            <Box
                                key={template.id}
                                sx={{
                                    display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 1fr auto',
                                    gap: 2, p: 2, alignItems: 'center',
                                    borderBottom: index < filteredTemplates.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    opacity: template.isPublished ? 1 : 0.6,
                                    '&:hover': { bgcolor: '#f8fafc' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                    <Box sx={{ width: 40, height: 52, borderRadius: 1, bgcolor: `${catConfig.color}12`, border: `1px solid ${catConfig.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BrushIcon sx={{ fontSize: 18, color: catConfig.color }} />
                                    </Box>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>{template.name}</Typography>
                                        <Typography variant="caption" color="#94a3b8" noWrap>{template.description}</Typography>
                                    </Box>
                                </Box>

                                <Chip label={`${catConfig.icon} ${catConfig.label}`} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content', bgcolor: `${catConfig.color}15`, color: catConfig.color }} />

                                <Chip
                                    label={template.isPremium ? 'Premium' : 'Free'}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content', bgcolor: template.isPremium ? '#8b5cf615' : '#10b98115', color: template.isPremium ? '#8b5cf6' : '#10b981' }}
                                />

                                <Chip
                                    label={template.isPublished ? 'Published' : 'Draft'}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content', bgcolor: template.isPublished ? '#667eea15' : '#f59e0b15', color: template.isPublished ? '#667eea' : '#f59e0b' }}
                                />

                                <Typography variant="body2" fontWeight="600" color="#1e293b">{template.uses.toLocaleString()}</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    {template.rating > 0 ? (
                                        <>
                                            <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">{template.rating}</Typography>
                                        </>
                                    ) : (
                                        <Typography variant="caption" color="#94a3b8">N/A</Typography>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEditOpen(template)}><EditIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></IconButton></Tooltip>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, template)}><MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></IconButton>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ═══════════ CONTEXT MENU ═══════════ */}
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 } }}>
                {selectedTemplate?.previewImage && (
                    <MenuItem onClick={() => handlePreviewOpen()} sx={{ py: 1 }}>
                        <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
                        <ListItemText primary="Preview" />
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleEditOpen()} sx={{ py: 1 }}>
                    <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Edit Template" />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => handleTogglePremium()} sx={{ py: 1 }}>
                    <ListItemIcon>{selectedTemplate?.isPremium ? <LockOpenIcon fontSize="small" sx={{ color: '#10b981' }} /> : <WorkspacePremiumIcon fontSize="small" sx={{ color: '#8b5cf6' }} />}</ListItemIcon>
                    <ListItemText primary={selectedTemplate?.isPremium ? 'Set as Free' : 'Set as Premium'} primaryTypographyProps={{ color: selectedTemplate?.isPremium ? '#10b981' : '#8b5cf6' }} />
                </MenuItem>
                <MenuItem onClick={() => handleTogglePublished()} sx={{ py: 1 }}>
                    <ListItemIcon>{selectedTemplate?.isPublished ? <VisibilityOffIcon fontSize="small" sx={{ color: '#f59e0b' }} /> : <PublicIcon fontSize="small" sx={{ color: '#667eea' }} />}</ListItemIcon>
                    <ListItemText primary={selectedTemplate?.isPublished ? 'Unpublish' : 'Publish'} />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => handleDeleteOpen()} sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}>
                    <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{ color: '#ef4444' }} />
                </MenuItem>
            </Menu>

            {/* ═══════════ CREATE DIALOG ═══════════ */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon sx={{ color: '#667eea' }} /> New Template
                </DialogTitle>
                <DialogContent>
                    {/* ⬇️ Paste the form JSX directly here instead of <TemplateForm /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Name */}
                        <TextField
                            fullWidth
                            label="Template Name"
                            placeholder="e.g. Modern Professional"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                            }}
                        />

                        {/* Category */}
                        <FormControl fullWidth>
                            <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                                }}
                            >
                                {CATEGORIES.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Typography fontSize="1rem">{cat.icon}</Typography>
                                            <Typography variant="body2">{cat.label}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Description */}
                        <TextField
                            fullWidth
                            label="Description"
                            placeholder="Brief description of the template..."
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                            }}
                        />

                        {/* Premium / Free Toggle */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: formData.isPremium ? '#8b5cf608' : '#10b98108',
                                border: `1px solid ${formData.isPremium ? '#8b5cf620' : '#10b98120'}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {formData.isPremium ? (
                                        <WorkspacePremiumIcon sx={{ color: '#8b5cf6' }} />
                                    ) : (
                                        <LockOpenIcon sx={{ color: '#10b981' }} />
                                    )}
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">
                                            {formData.isPremium ? 'Premium Template' : 'Free Template'}
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">
                                            {formData.isPremium
                                                ? 'Only premium users can access this template'
                                                : 'Available to all users'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch
                                    checked={formData.isPremium}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isPremium: e.target.checked }))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Published Toggle */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: formData.isPublished ? '#667eea08' : '#f59e0b08',
                                border: `1px solid ${formData.isPublished ? '#667eea20' : '#f59e0b20'}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {formData.isPublished ? (
                                        <PublicIcon sx={{ color: '#667eea' }} />
                                    ) : (
                                        <VisibilityOffIcon sx={{ color: '#f59e0b' }} />
                                    )}
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">
                                            {formData.isPublished ? 'Published' : 'Draft / Unpublished'}
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">
                                            {formData.isPublished
                                                ? 'Visible to users on the templates page'
                                                : 'Hidden from users until published'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#667eea' },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Preview Image Upload */}
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
                                Preview Image
                            </Typography>

                            {formData.previewImage ? (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 2,
                                        border: '1px solid #e2e8f0',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 200,
                                            bgcolor: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {formData.previewImage.startsWith('data:') || formData.previewImage.startsWith('/') ? (
                                            <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                                                <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography variant="caption" display="block">
                                                    {formData.previewFileName}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1.5,
                                            bgcolor: '#f8fafc',
                                            borderTop: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <Typography variant="caption" color="#64748b" noWrap sx={{ flex: 1 }}>
                                            {formData.previewFileName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Button
                                                size="small"
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#667eea' }}
                                            >
                                                Replace
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={handleRemoveImage}
                                                sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#ef4444' }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        height: 160,
                                        borderRadius: 2,
                                        border: '2px dashed #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08' },
                                    }}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                                    <Typography variant="body2" fontWeight="600" color="#64748b">
                                        Click to upload preview image
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        PNG, JPG up to 5MB (recommended: 600x800px)
                                    </Typography>
                                </Box>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setCreateDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" disabled={!formData.name.trim()} onClick={handleCreateConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6fd6' } }}>
                        Create Template
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ EDIT DIALOG ═══════════ */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditIcon sx={{ color: '#667eea' }} /> Edit Template
                </DialogTitle>
                <DialogContent>
                    {/* ⬇️ Paste the form JSX directly here instead of <TemplateForm /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Name */}
                        <TextField
                            fullWidth
                            label="Template Name"
                            placeholder="e.g. Modern Professional"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                            }}
                        />

                        {/* Category */}
                        <FormControl fullWidth>
                            <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                                }}
                            >
                                {CATEGORIES.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Typography fontSize="1rem">{cat.icon}</Typography>
                                            <Typography variant="body2">{cat.label}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Description */}
                        <TextField
                            fullWidth
                            label="Description"
                            placeholder="Brief description of the template..."
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                            }}
                        />

                        {/* Premium / Free Toggle */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: formData.isPremium ? '#8b5cf608' : '#10b98108',
                                border: `1px solid ${formData.isPremium ? '#8b5cf620' : '#10b98120'}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {formData.isPremium ? (
                                        <WorkspacePremiumIcon sx={{ color: '#8b5cf6' }} />
                                    ) : (
                                        <LockOpenIcon sx={{ color: '#10b981' }} />
                                    )}
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">
                                            {formData.isPremium ? 'Premium Template' : 'Free Template'}
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">
                                            {formData.isPremium
                                                ? 'Only premium users can access this template'
                                                : 'Available to all users'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch
                                    checked={formData.isPremium}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isPremium: e.target.checked }))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Published Toggle */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: formData.isPublished ? '#667eea08' : '#f59e0b08',
                                border: `1px solid ${formData.isPublished ? '#667eea20' : '#f59e0b20'}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {formData.isPublished ? (
                                        <PublicIcon sx={{ color: '#667eea' }} />
                                    ) : (
                                        <VisibilityOffIcon sx={{ color: '#f59e0b' }} />
                                    )}
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">
                                            {formData.isPublished ? 'Published' : 'Draft / Unpublished'}
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">
                                            {formData.isPublished
                                                ? 'Visible to users on the templates page'
                                                : 'Hidden from users until published'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#667eea' },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Preview Image Upload */}
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
                                Preview Image
                            </Typography>

                            {formData.previewImage ? (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 2,
                                        border: '1px solid #e2e8f0',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 200,
                                            bgcolor: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {formData.previewImage.startsWith('data:') || formData.previewImage.startsWith('/') ? (
                                            <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                                                <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography variant="caption" display="block">
                                                    {formData.previewFileName}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1.5,
                                            bgcolor: '#f8fafc',
                                            borderTop: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <Typography variant="caption" color="#64748b" noWrap sx={{ flex: 1 }}>
                                            {formData.previewFileName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Button
                                                size="small"
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#667eea' }}
                                            >
                                                Replace
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={handleRemoveImage}
                                                sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#ef4444' }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        height: 160,
                                        borderRadius: 2,
                                        border: '2px dashed #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08' },
                                    }}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                                    <Typography variant="body2" fontWeight="600" color="#64748b">
                                        Click to upload preview image
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        PNG, JPG up to 5MB (recommended: 600x800px)
                                    </Typography>
                                </Box>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" disabled={!formData.name.trim()} onClick={handleEditConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6fd6' } }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ DELETE DIALOG ═══════════ */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WarningAmberIcon /> Delete Template</Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b">
                        Delete <strong>&quot;{selectedTemplate?.name}&quot;</strong>? This will remove the template for all users.
                    </Typography>
                    {selectedTemplate?.uses > 0 && (
                        <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                            This template has been used {selectedTemplate.uses.toLocaleString()} times. Users with this template will need to switch to another one.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>Delete Template</Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ PREVIEW DIALOG ═══════════ */}
            <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Box>
                        <Typography variant="body1" fontWeight="700" color="#1e293b">{selectedTemplate?.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip label={selectedTemplate?.isPremium ? 'Premium' : 'Free'} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20, bgcolor: selectedTemplate?.isPremium ? '#8b5cf615' : '#10b98115', color: selectedTemplate?.isPremium ? '#8b5cf6' : '#10b981' }} />
                            <Chip label={getCategoryConfig(selectedTemplate?.category).label} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<EditIcon />} onClick={() => { setPreviewDialogOpen(false); handleEditOpen(selectedTemplate); }} sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>Edit</Button>
                        <IconButton onClick={() => setPreviewDialogOpen(false)}><CloseIcon /></IconButton>
                    </Box>
                </Box>
                <Box sx={{ height: '70vh', bgcolor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                    <Box sx={{ width: { xs: 300, md: 450 }, height: { xs: 424, md: 636 }, bgcolor: '#ffffff', borderRadius: 2, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                            <ImageIcon sx={{ fontSize: 60, mb: 1 }} />
                            <Typography variant="body2">Template Preview</Typography>
                            <Typography variant="caption">{selectedTemplate?.previewImage}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}