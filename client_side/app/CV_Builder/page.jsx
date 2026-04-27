"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Stack,
    Grid,
    Collapse,
    Modal,
    CircularProgress,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Divider,
    Alert,
    Fade,
    Backdrop,
    styled,
    keyframes,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import LanguageIcon from '@mui/icons-material/Language';
import InterestsIcon from '@mui/icons-material/Interests';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SportsIcon from '@mui/icons-material/Sports';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DrawIcon from '@mui/icons-material/Draw';
import ArticleIcon from '@mui/icons-material/Article';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";

// Template Imports
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";
import Template3 from "../components/templates/Template3";
import Template4 from "../components/templates/Template4";
// import Template5 from "../../public/templates/template5";
import Template6 from "../components/templates/Template6";

// Component Imports
import PersonalInfoForm from "../components/CV_Sections/PersonalInfoForm";
import ProfileSection from "../components/CV_Sections/ProfileSection";
import EducationSection from "../components/CV_Sections/EducationSection";
import ExperienceSection from "../components/CV_Sections/ExperienceSection";
import SkillsSection from "../components/CV_Sections/SkillsSection";
import LanguagesSection from "../components/CV_Sections/LanguagesSection";
import InterestsSection from "../components/CV_Sections/InterestsSection";
import AdditionalSectionForm from "../components/CV_Sections/AdditionalSectionForm";
import { useCvBuilderApi } from "../lib/useCvBuilderApi";
import { useSectionMenu } from "../hooks/useSectionMenu";


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

// =============================================
// KEYFRAMES
// =============================================
const modalSlideIn = keyframes`
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;



const scaleIn = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;



// =============================================
// STYLED COMPONENTS
// =============================================
const MainContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
    },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '&::-webkit-scrollbar': {
        width: 8,
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: 4,
        '&:hover': {
            background: '#a1a1a1',
        },
    },
    [theme.breakpoints.up('md')]: {
        width: '50%',
    },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
        width: '50%',
    },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32,
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
    },
}));

const UploadCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    border: `2px dashed ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius * 2,
    flex: 1,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

const AdditionalSectionCard = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isActive'
})(({ theme, isActive }) => ({
    padding: theme.spacing(1.5),
    border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.grey[200]}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? theme.palette.primary.lighter || '#e3f2fd' : 'transparent',
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

const TemplatePreviewWrapper = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    backgroundColor: theme.palette.grey[200],
    borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    '&::-webkit-scrollbar': {
        width: 8,
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: 4,
    },
}));

const CVPrintRoot = styled(Box)(({ theme }) => ({
    width: '210mm',
    maxWidth: '210mm',
    backgroundColor: 'white',
    margin: '0 auto',
    boxSizing: 'border-box',
    position: 'relative',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'white',
    borderRadius: `0 0 ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px`,
}));

const ModalContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(4),
    maxWidth: 400,
    width: '90%',
    animation: `${modalSlideIn} 0.3s ease-out`,
    outline: 'none',
}));

const SuccessIcon = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    backgroundColor: theme.palette.success.light,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    animation: `${scaleIn} 0.5s ease-out`,
}));

const ErrorIconWrapper = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    backgroundColor: theme.palette.error.light,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #c5cae9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const LoadingCircle = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 128,
    height: 128,
    marginBottom: theme.spacing(4),
}));

const LoadingRing = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'progress'
})(({ theme, progress }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: `4px solid ${theme.palette.primary.main}`,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: `rotate(${progress * 3.6}deg)`,
    transition: 'transform 0.15s linear',
    opacity: progress > 0 ? 1 : 0,
}));


// =============================================
// MAIN COMPONENT
// =============================================
const CvBuilder = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = useTheme();

    const {
        sectionMenuAnchor,
        sectionMenuTarget,
        sectionTitleOverrides,
        sectionColumn,
        sectionPageBreak,
        openSectionMenu,
        closeSectionMenu,
        renameSection,
        togglePageBreak,
        setColumn,
        openRenameDialog,  // ✅ MUST BE HERE
        confirmRename,     // ✅ MUST BE HERE
        renameOpen,
        renameValue,
        clearSectionLayout,
        setRenameValue,
    } = useSectionMenu();

    // =============================================
    // STATE DECLARATIONS
    // =============================================
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingProgress, setLoadingProgress] = useState(0);

    const urlTemplateId = searchParams.get("template");
    const cvIdParam = searchParams.get("id");

    const [cvId, setCvId] = useState(cvIdParam || null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(urlTemplateId || "1");
    const [selectedSection, setSelectedSection] = useState(null);

    const [cvData, setCvData] = useState({
        personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            profileImage: "",
            title: "",
            phoneNumber: "",
            city: "",
            sex: "",
            birthDate: "",
            placeOfBirth: "",
            drivingLicense: "",
            nationality: "",
            maritalStatus: "",
            website: "",
            personalInfo: "",
        },
        profile: "<p>Commencez à rédiger ici...</p>",
        education: [],
        experience: [],
        skills: [],
        languages: [],
        interests: [],
        courses: [],
        internships: [],
        extracurricular: [],
        references: [],
        qualities: [],
        certificates: [],
        achievements: [],
        signature: [],
        footer: [],
        customSections: [],
    });

    const [openFields, setOpenFields] = useState([]);
    const [activeAdditionalSections, setActiveAdditionalSections] = useState({});
    const [currentAdditionalSection, setCurrentAdditionalSection] = useState({});
    const [editingAdditionalIndex, setEditingAdditionalIndex] = useState(null);
    const [showAdditionalForm, setShowAdditionalForm] = useState({});
    const [signatureMode, setSignatureMode] = useState('draw');
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState('');
    const [expandedAdditionalSections, setExpandedAdditionalSections] = useState({});
    const [pendingDeleteField, setPendingDeleteField] = useState(null);
    const [showSectionOptions, setShowSectionOptions] = useState(null);
    const [showParseSuccess, setShowParseSuccess] = useState(false);
    const [recentlyUpdatedSections, setRecentlyUpdatedSections] = useState([]);



    // Education states
    const [currentEducation, setCurrentEducation] = useState({
        education: "", school: "", city: "", startMonth: "", startYear: "",
        endMonth: "", endYear: "", isPresent: false, description: ""
    });
    const [showEducationForm, setShowEducationForm] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);




    const getSectionTitle = (sectionId, defaultTitle) =>
        sectionTitleOverrides[sectionId] || defaultTitle;




    const handleClearSection = () => {
        const target = sectionMenuTarget;

        setCvData(prev => {
            const next = { ...prev };

            // main numeric sections
            if (target === 1) {
                next.personalInfo = {
                    ...prev.personalInfo,
                    firstName: "",
                    lastName: "",
                    email: "",
                    address: "",
                    profileImage: "",
                    title: "",
                    phoneNumber: "",
                    city: "",
                    sex: "",
                    birthDate: "",
                    placeOfBirth: "",
                    drivingLicense: "",
                    nationality: "",
                    maritalStatus: "",
                    website: "",
                    personalInfo: "",
                };
            } else if (target === 2) next.profile = "<p>Commencez à rédiger ici...</p>";
            else if (target === 3) next.education = [];
            else if (target === 4) next.experience = [];
            else if (target === 5) next.skills = [];
            else if (target === 6) next.languages = [];
            else if (target === 7) next.interests = [];

            // additional sections (string IDs like "courses", "certificates"...)
            if (typeof target === "string") {
                next[target] = [];
            }

            return next;
        });

        clearSectionLayout(target);

        closeSectionMenu();
    };

    // Experience states
    const [currentExperience, setCurrentExperience] = useState({
        position: "", employer: "", city: "", startMonth: "", startYear: "",
        endMonth: "", endYear: "", isPresent: false, description: ""
    });
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [showExperienceForm, setShowExperienceForm] = useState(true);

    // Skills states
    const [currentSkill, setCurrentSkill] = useState({ skill: "", level: "" });
    const [editingSkillIndex, setEditingSkillIndex] = useState(null);
    const [showSkillForm, setShowSkillForm] = useState(true);

    // Language states
    const [currentLanguage, setCurrentLanguage] = useState({ language: "", level: "" });
    const [editingLanguageIndex, setEditingLanguageIndex] = useState(null);
    const [showLanguageForm, setShowLanguageForm] = useState(true);
    const [isImportingLinkedIn, setIsImportingLinkedIn] = useState(false);

    // Interest states
    const [currentInterest, setCurrentInterest] = useState({ interest: "" });
    const [editingInterestIndex, setEditingInterestIndex] = useState(null);
    const [showInterestForm, setShowInterestForm] = useState(true);

    // =============================================
    // REFS
    // =============================================
    const canvasRef = useRef(null);
    const cvPreviewRef = useRef(null);
    const cvPrintRef = useRef(null);

    // =============================================
    // CONSTANTS
    // =============================================
    const templates = [
        { id: 1, name: "Template1" }, { id: 2, name: "Template2" }, { id: 3, name: "Template3" },
        { id: 4, name: "Template4" }, { id: 5, name: "Template5" }, { id: 6, name: "Template6" },
        { id: 7, name: "Template7" }, { id: 8, name: "Template8" }, { id: 9, name: "Template9" },
        { id: 10, name: "Template10" }, { id: 11, name: "Template11" }, { id: 12, name: "Template12" },
        { id: 13, name: "Template13" }, { id: 14, name: "Template14" }, { id: 15, name: "Template15" },
    ];

    const sections = [
        { id: 1, title: "Personal Information", icon: <PersonIcon /> },
        { id: 2, title: "Profile", icon: <DescriptionIcon /> },
        { id: 3, title: "Education", icon: <SchoolIcon /> },
        { id: 4, title: "Experience", icon: <WorkIcon /> },
        { id: 5, title: "Skills", icon: <BuildIcon /> },
        { id: 6, title: "Languages", icon: <LanguageIcon /> },
        { id: 7, title: "Interests", icon: <InterestsIcon /> },
    ];

    const additionalSections = [
        { id: 'courses', title: 'Courses', icon: <MenuBookIcon /> },
        { id: 'internships', title: 'Internships', icon: <BusinessCenterIcon /> },
        { id: 'extracurricular', title: 'Extracurricular Activities', icon: <SportsIcon /> },
        { id: 'references', title: 'References', icon: <PeopleIcon /> },
        { id: 'qualities', title: 'Qualities', icon: <StarIcon /> },
        { id: 'certificates', title: 'Certificates', icon: <EmojiEventsIcon /> },
        { id: 'achievements', title: 'Achievements', icon: <RocketLaunchIcon /> },
        { id: 'signature', title: 'Signature', icon: <DrawIcon /> },
        { id: 'footer', title: 'Footer', icon: <ArticleIcon /> },
        { id: 'custom', title: 'Custom Section', icon: <AddBoxIcon /> },
    ];

    const selectedTemplate = templates.find((template) => template.id === Number(selectedTemplateId));

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: ["", "center", "right", "justify"] }],
            ["link"],
            ["clean"],
        ],
    };

    const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "link", "align"];

    // =============================================
    // HELPER FUNCTIONS
    // =============================================
    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const getDefaultFields = (sectionId) => {
        const fieldConfig = {
            courses: { course: "", month: "", year: "", isPresent: false, description: "" },
            internships: { position: "", employer: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isPresent: false, description: "" },
            extracurricular: { position: "", employer: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isPresent: false, description: "" },
            references: { name: "", company: "", city: "", phone: "", email: "" },
            qualities: { quality: "" },
            certificates: { certificate: "", month: "", year: "", isPresent: false, description: "" },
            achievements: { description: "" },
            signature: { city: "", date: "", signature: "", signatureType: "draw" },
            footer: { description: "" },
            custom: { type: 'description', description: "", entries: [], skills: [], list: [] }
        };
        return fieldConfig[sectionId] || {};
    };

    const getLevelDisplayText = (levelCode) => {
        const levelMap = { "01": "Beginner", "02": "Intermediate", "03": "Good", "04": "Very Good", "05": "Excellent" };
        return levelMap[levelCode] || levelCode || "Not specified";
    };

    const getLanguageLevelDisplayText = (levelCode) => {
        const levelMap = { "01": "Beginner", "02": "Intermediate", "03": "Good", "04": "Very Good", "05": "Fluent", "06": "Native" };
        return levelMap[levelCode] || levelCode || "Not specified";
    };

    // =============================================
    // ADDITIONAL SECTIONS FUNCTIONS
    // =============================================
    const addAdditionalSection = (sectionId) => {
        setActiveAdditionalSections(prev => ({ ...prev, [sectionId]: true }));
        const sectionHasData = cvData[sectionId] && cvData[sectionId].length > 0;
        if (!sectionHasData) {
            setCurrentAdditionalSection({
                id: sectionId, title: "", description: "", period: "", course: "", location: "",
                ...getDefaultFields(sectionId)
            });
            setShowAdditionalForm(prev => ({ ...prev, [sectionId]: true }));
        } else {
            setShowAdditionalForm(prev => ({ ...prev, [sectionId]: false }));
        }
        setExpandedAdditionalSections(prev => ({ ...prev, [sectionId]: true }));
        setEditingAdditionalIndex(null);
    };

    const removeAdditionalSection = (sectionId) => {
        setActiveAdditionalSections(prev => ({ ...prev, [sectionId]: false }));
        setCvData(prev => ({ ...prev, [sectionId]: [] }));
    };

    const toggleAdditionalSection = (sectionId) => {
        setExpandedAdditionalSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const addToAdditionalSection = (sectionId) => {
        const requiredFields = {
            courses: ['course'],
            internships: ['position', 'employer'],
            extracurricular: ['position', 'employer'],
            references: ['name'],
            qualities: ['quality'],
            certificates: ['certificate'],
            achievements: ['description'],
            signature: ['date'],
            footer: ['description'],
            custom: ['']
        };
        const fields = requiredFields[sectionId] || ['title'];

        if (sectionId === 'signature' && !currentAdditionalSection.signature) {
            showError("Please create or upload your signature.");
            return;
        }

        const missingFields = fields.filter(field => {
            const value = currentAdditionalSection[field];
            if (value === null || value === undefined || value === '') return true;
            if (typeof value === 'string') return !value.trim();
            return false;
        });

        if (missingFields.length > 0 && sectionId !== 'footer' && sectionId !== 'signature') {
            showError(`Please fill in the required fields.`);
            return;
        }

        const itemToAdd = {
            ...currentAdditionalSection,
            id: `${sectionId}-${crypto.randomUUID().toString(36).substr(2, 9)}`
        };

        setCvData(prev => ({ ...prev, [sectionId]: [...prev[sectionId], itemToAdd] }));
        setCurrentAdditionalSection({ id: sectionId, title: "", description: "", ...getDefaultFields(sectionId) });
        setShowAdditionalForm(prev => ({ ...prev, [sectionId]: false }));
        setEditingAdditionalIndex(null);
        if (sectionId === 'signature') setSignatureMode('draw');
    };

    const updateAdditionalSection = (sectionId, index) => {
        setCvData(prev => {
            const updated = [...prev[sectionId]];
            updated[index] = { ...currentAdditionalSection, id: currentAdditionalSection.id || `${sectionId}-${crypto.randomUUID()}` };
            return { ...prev, [sectionId]: updated };
        });
        setEditingAdditionalIndex(null);
        setCurrentAdditionalSection({ id: sectionId, title: "", description: "", ...getDefaultFields(sectionId) });
        setShowAdditionalForm(prev => ({ ...prev, [sectionId]: false }));
    };

    const removeFromAdditionalSection = (sectionId, index) => {
        setCvData(prev => ({ ...prev, [sectionId]: prev[sectionId].filter((_, i) => i !== index) }));
    };

    // =============================================
    // SIGNATURE FUNCTIONS
    // =============================================
    const startDrawing = (e) => {
        if (signatureMode !== 'draw') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || signatureMode !== 'draw') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
        const signatureDataUrl = canvas.toDataURL();
        setSignatureData(signatureDataUrl);
        setCurrentAdditionalSection(prev => ({ ...prev, signature: signatureDataUrl, signatureType: 'draw' }));
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setSignatureData('');
        if (editingAdditionalIndex === null) {
            setCurrentAdditionalSection(prev => ({ ...prev, signature: '', signatureType: 'draw' }));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCurrentAdditionalSection(prev => ({ ...prev, signature: event.target.result, signatureType: 'upload' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTypedSignature = (e) => {
        setCurrentAdditionalSection(prev => ({ ...prev, signature: e.target.value, signatureType: 'type' }));
    };

    // =============================================
    // FORM ADD FUNCTIONS
    // =============================================
    const addTraining = () => {
        setCvData(prev => ({ ...prev, education: [...prev.education, { ...currentEducation, id: crypto.randomUUID() }] }));
        setShowEducationForm(false);
        setCurrentEducation({
            education: "", school: "", city: "", startMonth: "", startYear: "",
            endMonth: "", endYear: "", isPresent: false, description: ""
        });
    };

    const addSkills = () => {
        if (!currentSkill.skill || !currentSkill.level) {
            showError("Please fill in all fields.");
            return;
        }
        const skillToAdd = { ...currentSkill, skill: String(currentSkill.skill), level: String(currentSkill.level) };
        if (editingSkillIndex !== null) {
            setCvData(prev => {
                const updated = [...prev.skills];
                updated[editingSkillIndex] = skillToAdd;
                return { ...prev, skills: updated };
            });
            setEditingSkillIndex(null);
        } else {
            setCvData(prev => ({ ...prev, skills: [...prev.skills, { ...skillToAdd, id: crypto.randomUUID() }] }));
            setShowSkillForm(false);
        }
        setCurrentSkill({ skill: "", level: "" });
    };

    const addLanguage = () => {
        if (!currentLanguage.language || !currentLanguage.level) {
            showError("Please fill in all fields.");
            return;
        }
        const languageToAdd = { ...currentLanguage, language: String(currentLanguage.language), level: String(currentLanguage.level) };
        if (editingLanguageIndex !== null) {
            setCvData(prev => {
                const updated = [...prev.languages];
                updated[editingLanguageIndex] = languageToAdd;
                return { ...prev, languages: updated };
            });
            setEditingLanguageIndex(null);
        } else {
            setCvData(prev => ({ ...prev, languages: [...prev.languages, { ...languageToAdd, id: crypto.randomUUID() }] }));
            setShowLanguageForm(false);
        }
        setCurrentLanguage({ language: "", level: "" });
    };

    const addInterest = () => {
        if (!currentInterest.interest) {
            showError("Please fill in the interest field.");
            return;
        }
        const interestToAdd = { ...currentInterest, interest: String(currentInterest.interest || "") };
        if (editingInterestIndex !== null) {
            setCvData(prev => {
                const updated = [...prev.interests];
                updated[editingInterestIndex] = interestToAdd;
                return { ...prev, interests: updated };
            });
            setEditingInterestIndex(null);
        } else {
            setCvData(prev => ({ ...prev, interests: [...prev.interests, { ...interestToAdd, id: crypto.randomUUID() }] }));
            setShowInterestForm(false);
        }
        setCurrentInterest({ interest: "" });
    };

    const handleLinkedInImport = () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // http://localhost:8000
        if (!backendUrl) return showError("NEXT_PUBLIC_BACKEND_URL is not set");

        setIsImportingLinkedIn(true);

        const popup = window.open(
            `${backendUrl}/api/auth/linkedin/redirect`,
            "linkedin_oauth",
            "width=600,height=720"
        );

        if (!popup) {
            setIsImportingLinkedIn(false);
            return showError("Please allow popups to import LinkedIn.");
        }

        const backendOrigin = new URL(backendUrl).origin;
        let received = false;

        const cleanup = () => {
            window.removeEventListener("message", onMessage);
            setIsImportingLinkedIn(false);
        };

        const onMessage = (event) => {
            // message comes FROM backend origin (localhost:8000)
            if (event.origin !== backendOrigin) return;
            if (event.data?.type !== "linkedin-profile") return;

            received = true;

            const data = event.data.payload;

            // If backend sent an error payload, show it
            if (data?.linkedinError) {
                showError(JSON.stringify(data.linkedinError, null, 2));
                cleanup();
                try { popup.close(); } catch { }
                return;
            }

            // Success: merge into cvData
            setCvData(prev => mergeParsedIntoCvData(prev, data));
            setSelectedSection(1);

            cleanup();
            try { popup.close(); } catch { }
        };

        window.addEventListener("message", onMessage);

        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
                cleanup();
                if (!received) showError("LinkedIn import was cancelled or failed (no response received).");
            }
        }, 400);
    };

    // In CvBuilder.jsx - Update the initialization logic

    // Add this useEffect to read the template from URL on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            // Get template from URL parameter
            const urlTemplateId = searchParams.get("template");

            if (urlTemplateId) {
                setSelectedTemplateId(urlTemplateId);

                // Optionally, also check localStorage for additional template info
                try {
                    const storedSelection = localStorage.getItem('selectedTemplate');
                    if (storedSelection) {
                        const parsed = JSON.parse(storedSelection);
                        console.log('Template selected:', parsed.templateName);
                        // Clear after reading to avoid stale data
                        // localStorage.removeItem('selectedTemplate');
                    }
                } catch (e) {
                    console.log('No stored template selection');
                }
            }

            // Rest of your initialization logic...
            setIsDataLoaded(true);
        };

        fetchInitialData();
    }, [searchParams]);

    // =============================================
    // DATA FETCHING
    // =============================================
    useEffect(() => {
        const fetchCvData = async () => {
            if (!cvId) {
                setIsDataLoaded(true);
                return;
            }

            try {
                const fetchedData = await getCv(cvId);

                if (fetchedData.template_id) {
                    setSelectedTemplateId(String(fetchedData.template_id));
                }

                const newActiveSections = {};
                const additionalKeys = [
                    'courses', 'internships', 'extracurricular', 'references',
                    'qualities', 'certificates', 'achievements', 'signature',
                    'footer', 'customSections'
                ];

                additionalKeys.forEach(key => {
                    if (fetchedData[key] && fetchedData[key].length > 0) {
                        newActiveSections[key] = true;
                        setExpandedAdditionalSections(prev => ({ ...prev, [key]: true }));
                    }
                });
                setActiveAdditionalSections(newActiveSections);

                setCvData(prev => ({
                    ...prev,
                    ...fetchedData,
                    personalInfo: { ...prev.personalInfo, ...fetchedData.personalInfo }
                }));

                setIsDataLoaded(true);

            } catch (error) {
                console.error("Failed to fetch CV:", error);
                setIsDataLoaded(true);
                if (error.response?.status !== 401) {
                    showError("Could not load CV data. Please check your connection or try again.");
                }
            }
        };

        fetchCvData();
    }, [cvId]);

    useEffect(() => {
        if (recentlyUpdatedSections.length > 0) {
            const timer = setTimeout(() => {
                setRecentlyUpdatedSections([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdatedSections]);

    // =============================================
    // PROGRESS BAR
    // =============================================
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (!isDataLoaded && prev >= 90) return 90;
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsLoading(false), 200);
                        return 100;
                    }
                    return prev + (isDataLoaded ? 5 : 1);
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [isLoading, isDataLoaded]);

    // =============================================
    // SIGNATURE CANVAS SETUP
    // =============================================
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && signatureMode === 'draw') {
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (editingAdditionalIndex !== null && currentAdditionalSection.signature && currentAdditionalSection.signatureType === 'draw') {
                const img = new Image();
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                    setSignatureData(currentAdditionalSection.signature);
                };
                img.src = currentAdditionalSection.signature;
            }
        }
    }, [signatureMode, editingAdditionalIndex, currentAdditionalSection.signature, currentAdditionalSection.signatureType]);

    // =============================================
    // CLICK OUTSIDE HANDLER
    // =============================================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.section-options-container')) setShowSectionOptions(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // =============================================
    // SAVE CV FUNCTION
    // =============================================
    const handleSaveCv = async () => {
        setIsSaving(true);

        try {
            const stripIds = (arr) => arr.map(({ id, ...rest }) => rest);

            const payload = {
                title: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} CV`.trim() || "My CV",
                template_id: Number(selectedTemplateId),
                personalInfo: cvData.personalInfo,
                profile: cvData.profile,
                education: stripIds(cvData.education),
                experience: stripIds(cvData.experience),
                skills: stripIds(cvData.skills),
                languages: stripIds(cvData.languages),
                interests: stripIds(cvData.interests),
                courses: cvData.courses,
                internships: cvData.internships,
                extracurricular: cvData.extracurricular,
                references: cvData.references,
                qualities: cvData.qualities,
                certificates: cvData.certificates,
                achievements: cvData.achievements,
                signature: cvData.signature,
                footer: cvData.footer,
                customSections: cvData.customSections,
            };


            let response;

            if (cvId) {
                response = await updateCv(cvId, payload);
            } else {
                response = await createCv(payload);
                setCvId(response.id);

                const newParams = new URLSearchParams(searchParams);
                newParams.set("id", response.id);
                router.replace(`?${newParams.toString()}`, { scroll: false });
            }

            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);

        } catch (error) {
            console.error("Save error:", error.response?.data || error);
            showError(JSON.stringify(error.response?.data, null, 2));
        } finally {
            setIsSaving(false);
        }
    };

    // =============================================
    // PDF DOWNLOAD FUNCTION
    // =============================================
    const handleDownloadCV = useCallback(() => {
        const printContent = cvPrintRef.current;
        if (!printContent) {
            showError("CV preview not found.");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showError("Please allow popups to download PDF.");
            return;
        }

        let allStyles = '';
        document.querySelectorAll('style').forEach(s => allStyles += s.outerHTML);

        try {
            Array.from(document.styleSheets).forEach(sheet => {
                try {
                    let css = '';
                    Array.from(sheet.cssRules || []).forEach(rule => css += rule.cssText);
                    if (css) allStyles += `<style>${css}</style>`;
                } catch (e) {
                    if (sheet.href) allStyles += `<link rel="stylesheet" href="${sheet.href}">`;
                }
            });
        } catch (e) { }

        const clone = printContent.cloneNode(true);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>CV - ${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}</title>
                ${allStyles}
                <style>
                    @page { size: A4; margin: 10mm; }
                    * { box-sizing: border-box; }
                    html, body {
                        margin: 0; padding: 0; background: white; width: 210mm;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-wrapper { width: 100%; max-width: 210mm; background: white; }
                    .cv-print-root { width: 100% !important; max-width: 210mm !important; min-height: auto !important; height: auto !important; }
                    section, .section, .cv-section { page-break-inside: avoid; break-inside: avoid; }
                    p, li, h1, h2, h3, h4, h5, h6 { orphans: 3; widows: 3; }
                    img { page-break-inside: avoid; break-inside: avoid; }
                    @media print { html, body { width: 210mm; height: auto; } .print-wrapper { width: 100%; margin: 0; padding: 0; } }
                </style>
            </head>
            <body>
                <div class="print-wrapper">${clone.outerHTML}</div>
            </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                setTimeout(() => printWindow.close(), 500);
            }, 800);
        };
    }, [cvData.personalInfo.firstName, cvData.personalInfo.lastName]);

    // =============================================
    // TEMPLATE PREVIEW RENDERER
    // =============================================
    const renderTemplatePreview = (templateId, cvData) => {
        const safeCvData = { ...cvData };
        const arrayFields = [
            'skills', 'languages', 'interests', 'courses', 'internships',
            'extracurricular', 'references', 'qualities', 'certificates',
            'achievements', 'signature', 'footer', 'customSections'
        ];

        arrayFields.forEach(field => {
            safeCvData[field] = (cvData[field] || []).map(item => {
                const cleanedItem = { ...item };
                Object.keys(cleanedItem).forEach(key => {
                    if (typeof cleanedItem[key] === 'string') {
                        cleanedItem[key] = String(cleanedItem[key] || "");
                    }
                });
                return cleanedItem;
            });
        });

        const templateComponents = {
            1: Template1, 2: Template2, 3: Template3, 4: Template4, 6: Template6   //5: Template5,
        };

        const TemplateComponent = templateComponents[templateId];

        if (TemplateComponent && typeof TemplateComponent === 'function') {
            return (
                <CVPrintRoot ref={cvPrintRef} id="cv-pdf-content">
                    <TemplateComponent
                        cvData={safeCvData}
                        sectionTitleOverrides={sectionTitleOverrides}
                        sectionColumn={sectionColumn}
                        sectionPageBreak={sectionPageBreak}
                    />
                </CVPrintRoot>
            );
        }

        return (
            <Typography color="text.secondary" textAlign="center" sx={{ mt: 8 }}>
                No selected template
            </Typography>
        );
    };

    const addIds = (arr = []) => arr.map(item => ({ ...item, id: item.id ?? crypto.randomUUID() }));

    const mergeParsedIntoCvData = (prev, parsed) => {
        // Merge only fields that exist; keep user edits if parsed is empty
        return {
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                ...(parsed.personalInfo || {}),
            },
            profile: parsed.profile ?? prev.profile,

            education: parsed.education?.length ? addIds(parsed.education) : prev.education,
            experience: parsed.experience?.length ? addIds(parsed.experience) : prev.experience,
            skills: parsed.skills?.length ? addIds(parsed.skills) : prev.skills,
            languages: parsed.languages?.length ? addIds(parsed.languages) : prev.languages,
            interests: parsed.interests?.length ? addIds(parsed.interests) : prev.interests,

            // optional additional sections if your parser returns them
            courses: parsed.courses?.length ? addIds(parsed.courses) : prev.courses,
            internships: parsed.internships?.length ? addIds(parsed.internships) : prev.internships,
            extracurricular: parsed.extracurricular?.length ? addIds(parsed.extracurricular) : prev.extracurricular,
            references: parsed.references?.length ? addIds(parsed.references) : prev.references,
            qualities: parsed.qualities?.length ? addIds(parsed.qualities) : prev.qualities,
            certificates: parsed.certificates?.length ? addIds(parsed.certificates) : prev.certificates,
            achievements: parsed.achievements?.length ? addIds(parsed.achievements) : prev.achievements,
        };
    };

    const handleCvUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // allow uploading same file again
        e.target.value = "";

        try {
            setIsParsingCv(true);

            const parsed = await parseCvFile(file);

            setCvData(prev => mergeParsedIntoCvData(prev, parsed));

            setRecentlyUpdatedSections(Object.keys(parsed)); // ✅ here

            setSelectedSection(1);

            setShowParseSuccess(true);

        } catch (err) {
            console.error(err);
            showError(err?.message || "Failed to parse CV");
        } finally {
            setIsParsingCv(false);
        }
    };

    const previewCvData = {
        ...cvData,

        education:
            showEducationForm &&
                (currentEducation.education ||
                    currentEducation.school ||
                    currentEducation.city ||
                    currentEducation.description)
                ? [...cvData.education, { ...currentEducation, id: "preview-education" }]
                : cvData.education,

        experience:
            showExperienceForm &&
                (currentExperience.position ||
                    currentExperience.employer ||
                    currentExperience.city ||
                    currentExperience.description)
                ? [...cvData.experience, { ...currentExperience, id: "preview-experience" }]
                : cvData.experience,

        skills:
            showSkillForm && (currentSkill.skill || currentSkill.level)
                ? [...cvData.skills, { ...currentSkill, id: "preview-skill" }]
                : cvData.skills,

        languages:
            showLanguageForm && (currentLanguage.language || currentLanguage.level)
                ? [...cvData.languages, { ...currentLanguage, id: "preview-language" }]
                : cvData.languages,

        interests:
            showInterestForm && currentInterest.interest
                ? [...cvData.interests, { ...currentInterest, id: "preview-interest" }]
                : cvData.interests,
    };

    // =============================================
    // TOGGLE SECTION HANDLER
    // =============================================
    const handleToggleSection = (sectionId) => {
        setSelectedSection(selectedSection === sectionId ? null : sectionId);
    };

    // =============================================
    // RENDER SECTION CONTENT
    // =============================================
    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 1:
                return (
                    <PersonalInfoForm
                        cvData={cvData}
                        setCvData={setCvData}
                        openFields={openFields}
                        setOpenFields={setOpenFields}
                        pendingDeleteField={pendingDeleteField}
                        setPendingDeleteField={setPendingDeleteField}
                    />
                );
            case 2:
                return (
                    <ProfileSection
                        cvData={cvData}
                        setCvData={setCvData}
                        quillModules={quillModules}
                        quillFormats={quillFormats}
                    />
                );
            case 3:
                return (
                    <EducationSection
                        cvData={cvData}
                        setCvData={setCvData}
                        currentEducation={currentEducation}
                        setCurrentEducation={setCurrentEducation}
                        showEducationForm={showEducationForm}
                        setShowEducationForm={setShowEducationForm}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        quillModules={quillModules}
                        quillFormats={quillFormats}
                        addTraining={addTraining}
                    />
                );
            case 4:
                return (
                    <ExperienceSection
                        cvData={cvData}
                        setCvData={setCvData}
                        currentExperience={currentExperience}
                        setCurrentExperience={setCurrentExperience}
                        editingExperienceIndex={editingExperienceIndex}
                        setEditingExperienceIndex={setEditingExperienceIndex}
                        showExperienceForm={showExperienceForm}
                        setShowExperienceForm={setShowExperienceForm}
                        quillModules={quillModules}
                        quillFormats={quillFormats}

                    />
                );
            case 5:
                return (
                    <SkillsSection
                        cvData={cvData}
                        setCvData={setCvData}
                        currentSkill={currentSkill}
                        setCurrentSkill={setCurrentSkill}
                        editingSkillIndex={editingSkillIndex}
                        setEditingSkillIndex={setEditingSkillIndex}
                        showSkillForm={showSkillForm}
                        setShowSkillForm={setShowSkillForm}
                        addSkills={addSkills}
                    />
                );
            case 6:
                return (
                    <LanguagesSection
                        cvData={cvData}
                        setCvData={setCvData}
                        currentLanguage={currentLanguage}
                        setCurrentLanguage={setCurrentLanguage}
                        editingLanguageIndex={editingLanguageIndex}
                        setEditingLanguageIndex={setEditingLanguageIndex}
                        showLanguageForm={showLanguageForm}
                        setShowLanguageForm={setShowLanguageForm}
                        addLanguage={addLanguage}
                    />
                );
            case 7:
                return (
                    <InterestsSection
                        cvData={cvData}
                        setCvData={setCvData}
                        currentInterest={currentInterest}
                        setCurrentInterest={setCurrentInterest}
                        editingInterestIndex={editingInterestIndex}
                        setEditingInterestIndex={setEditingInterestIndex}
                        showInterestForm={showInterestForm}
                        setShowInterestForm={setShowInterestForm}
                        addInterest={addInterest}
                    />
                );
            default:
                return null;
        }
    };
    const [isParsingCv, setIsParsingCv] = useState(false);
    const fileInputRef = useRef(null);
    const { getCv, createCv, updateCv, parseCvFile } = useCvBuilderApi();




    // =============================================
    // LOADING STATE
    // =============================================
    if (isLoading) {
        return (
            <LoadingContainer>
                <Box textAlign="center">
                    <LoadingCircle>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: 4,
                                borderColor: 'primary.light',
                            }}
                        />
                        <LoadingRing progress={loadingProgress} />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                {loadingProgress}%
                            </Typography>
                        </Box>
                    </LoadingCircle>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Loading your CV...
                    </Typography>
                </Box>
            </LoadingContainer>
        );
    }

    // =============================================
    // MAIN RENDER
    // =============================================
    return (
        <MainContainer>
            <ContentContainer>
                {/* ========== LEFT SIDEBAR - Forms ========== */}
                <SidebarContainer>
                    <Stack spacing={2} sx={{ pb: 2 }}>
                        {/* Upload Section */}
                        <SectionCard elevation={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <UploadCard
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{ opacity: isParsingCv ? 0.7 : 1, pointerEvents: isParsingCv ? "none" : "auto" }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            accept=".pdf,.docx"
                                            onChange={handleCvUpload}
                                        />

                                        <CloudUploadIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {isParsingCv ? "Parsing CV..." : "Upload existing CV"}
                                        </Typography>

                                        {isParsingCv && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
                                    </UploadCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <UploadCard
                                        onClick={handleLinkedInImport}
                                        sx={{ opacity: isImportingLinkedIn ? 0.7 : 1, pointerEvents: isImportingLinkedIn ? "none" : "auto" }}
                                    >
                                        <LinkedInIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {isImportingLinkedIn ? "Importing LinkedIn..." : "Import LinkedIn"}
                                        </Typography>
                                        {isImportingLinkedIn && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
                                    </UploadCard>
                                </Grid>
                            </Grid>
                        </SectionCard>

                        {/* Main Sections */}
                        {sections.map((section) => (
                            <SectionCard key={section.id} elevation={1} sx={{ border: recentlyUpdatedSections.includes(section.id) ? "2px solid green" : "none", }}>
                                <SectionHeader>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ color: "primary.main" }}>{section.icon}</Box>
                                        <Typography variant="h6" fontWeight="semibold">
                                            {getSectionTitle(section.id, section.title)}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <ToggleButton size="small" onClick={() => handleToggleSection(section.id)}>
                                            {selectedSection === section.id ? <RemoveIcon /> : <AddIcon />}
                                        </ToggleButton>

                                        <IconButton
                                            size="small"
                                            onClick={(e) => openSectionMenu(e, section.id)}
                                            className="section-options-container"
                                        >
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Stack>
                                </SectionHeader>

                                <Collapse in={selectedSection === section.id}>
                                    <Divider sx={{ mb: 2 }} />
                                    {renderSectionContent(section.id)}
                                </Collapse>
                            </SectionCard>
                        ))}

                        {/* Active Additional Sections */}
                        {Object.keys(activeAdditionalSections)
                            .filter(id => activeAdditionalSections[id])
                            .map(sectionId => {
                                const section = additionalSections.find(s => s.id === sectionId);
                                if (!section) return null;
                                return (
                                    <SectionCard key={sectionId} elevation={1}>
                                        <SectionHeader>
                                            <Typography variant="h6" fontWeight="semibold">
                                                {getSectionTitle(sectionId, section.title)}
                                            </Typography>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <ToggleButton size="small" onClick={() => toggleAdditionalSection(sectionId)}>
                                                    {expandedAdditionalSections[sectionId] ? <RemoveIcon /> : <AddIcon />}
                                                </ToggleButton>

                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => openSectionMenu(e, sectionId)}
                                                    className="section-options-container"
                                                >
                                                    <MoreHorizIcon />
                                                </IconButton>
                                            </Stack>
                                        </SectionHeader>
                                        <Collapse in={expandedAdditionalSections[sectionId]}>
                                            <Divider sx={{ mb: 2 }} />
                                            <AdditionalSectionForm
                                                sectionId={sectionId}
                                                currentAdditionalSection={currentAdditionalSection}
                                                setCurrentAdditionalSection={setCurrentAdditionalSection}
                                                editingAdditionalIndex={editingAdditionalIndex}
                                                signatureMode={signatureMode}
                                                setSignatureMode={setSignatureMode}
                                                isDrawing={isDrawing}
                                                setIsDrawing={setIsDrawing}
                                                signatureData={signatureData}
                                                setSignatureData={setSignatureData}
                                                handleFileUpload={handleFileUpload}
                                                handleTypedSignature={handleTypedSignature}
                                                clearCanvas={clearCanvas}
                                                startDrawing={startDrawing}
                                                draw={draw}
                                                stopDrawing={stopDrawing}
                                                quillModules={quillModules}
                                                quillFormats={quillFormats}
                                            />
                                        </Collapse>
                                    </SectionCard>
                                );
                            })}

                        {/* Additional Sections Grid */}
                        <SectionCard elevation={1}>
                            <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                                Additional Sections
                            </Typography>
                            <Grid container spacing={1.5}>
                                {additionalSections.map((section) => (
                                    <Grid item xs={6} sm={4} md={3} key={section.id}>
                                        <AdditionalSectionCard
                                            isActive={activeAdditionalSections[section.id]}
                                            onClick={() => addAdditionalSection(section.id)}
                                        >
                                            <Box sx={{ color: 'primary.main', mb: 1 }}>
                                                {section.icon}
                                            </Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {section.title}
                                            </Typography>
                                        </AdditionalSectionCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </SectionCard>
                    </Stack>
                </SidebarContainer>

                {/* ========== RIGHT PREVIEW - Template ========== */}
                <PreviewContainer>
                    <Paper
                        elevation={1}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Scrollable Template Preview */}
                        <TemplatePreviewWrapper>
                            {selectedTemplate ? (
                                renderTemplatePreview(selectedTemplate.id, previewCvData)
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 384,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        width: '100%',
                                    }}
                                >
                                    <Typography color="text.secondary">No template selected</Typography>
                                </Box>
                            )}
                        </TemplatePreviewWrapper>

                        {/* Fixed Download & Save Buttons */}
                        <ActionButtonsContainer>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveCv}
                                disabled={isSaving || !selectedTemplate}
                                sx={{ px: 4, py: 1 }}
                            >
                                {isSaving ? 'Saving...' : 'Save CV'}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadCV}
                                disabled={!selectedTemplate}
                                sx={{ px: 4, py: 1 }}
                            >
                                Download PDF
                            </Button>
                        </ActionButtonsContainer>
                    </Paper>
                </PreviewContainer>
            </ContentContainer>

            <Menu
                anchorEl={sectionMenuAnchor}
                open={Boolean(sectionMenuAnchor)}
                onClose={closeSectionMenu}
            >
                <MenuItem onClick={() => openRenameDialog(sections, additionalSections)}>
                    <ListItemText>Renommer la rubrique</ListItemText>
                </MenuItem>

                <MenuItem onClick={togglePageBreak}>
                    <ListItemText>
                        Insérer un saut de page {sectionMenuTarget && sectionPageBreak[sectionMenuTarget] ? "(ON)" : "(OFF)"}
                    </ListItemText>
                </MenuItem>

                <MenuItem onClick={handleClearSection}>
                    <ListItemText>Clear section</ListItemText>
                </MenuItem>

                <MenuItem disabled>
                    <ListItemText>Afficher la rubrique dans</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setColumn("left")}>
                    <ListItemText>Colonne de gauche</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setColumn("right")}>
                    <ListItemText>Colonne de droite</ListItemText>
                </MenuItem>
            </Menu>

            {/* Success Modal */}
            <Modal
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backdropFilter: 'blur(5px)' },
                }}
            >
                <Fade in={showSuccessModal}>
                    <ModalContent>
                        <Stack alignItems="center">
                            <SuccessIcon>
                                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </SuccessIcon>
                            <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
                                CV Saved Successfully!
                            </Typography>
                            <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                                Your CV has been {cvId ? "updated" : "created"} and saved successfully.
                                You can now download it as a PDF.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => setShowSuccessModal(false)}
                                sx={{ px: 4 }}
                            >
                                Continue Editing
                            </Button>
                        </Stack>
                    </ModalContent>
                </Fade>
            </Modal>

            {/* Error Modal */}
            <Modal
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backdropFilter: 'blur(5px)' },
                }}
            >
                <Fade in={showErrorModal}>
                    <ModalContent>
                        <Stack alignItems="center">
                            <ErrorIconWrapper>
                                <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />
                            </ErrorIconWrapper>
                            <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
                                An Error Occurred
                            </Typography>
                            <Typography
                                color="text.secondary"
                                textAlign="center"
                                sx={{
                                    mb: 3,
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: 160,
                                    overflow: 'auto',
                                }}
                            >
                                {errorMessage}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowErrorModal(false)}
                                sx={{ px: 4 }}
                            >
                                Close
                            </Button>
                        </Stack>
                    </ModalContent>
                </Fade>
            </Modal>

            <Modal
                open={showParseSuccess}
                onClose={() => setShowParseSuccess(false)}
            >
                <Fade in={showParseSuccess}>
                    <ModalContent>
                        <Stack alignItems="center">
                            <SuccessIcon>
                                <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
                            </SuccessIcon>

                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                CV Imported Successfully!
                            </Typography>

                            <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                                Your CV has been parsed and merged with your current data.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => setShowParseSuccess(false)}
                            >
                                Review Information
                            </Button>
                        </Stack>
                    </ModalContent>
                </Fade>
            </Modal>
            {/* Rename Section Dialog */}
            <Dialog
                open={renameOpen}
                onClose={() => setRenameValue("")}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Rename Section</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        label="New Section Name"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setRenameValue("")}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={confirmRename}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
};

export default CvBuilder;