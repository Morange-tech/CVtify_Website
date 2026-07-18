"use client";

import React, { Suspense, useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  Divider,
  Fade,
  Backdrop,
  TextField,
  Chip,
  styled,
  keyframes,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Select,
  InputAdornment,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Popover,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ArticleIcon from "@mui/icons-material/Article";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
  FileText, Briefcase, Search, ArrowLeft, UploadCloud,
  Link2, Building2, MapPin, Phone, Tag, Euro, ListChecks,
  Trash2, Check, Plus, X, Undo2, Redo2, Cloud, Languages,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLetterBuilderApi } from "../lib/useLetterBuilderApi";
import { useCvBuilderApi } from "../lib/useCvBuilderApi";
import { useAiAssist } from "../hooks/useAiAssist";
import useDownloads from "../hooks/useDownloads";
import useMyCvs from "../hooks/useMyCvs";
import { letterTemplateComponents, LETTER_TEMPLATE_LIST, SAMPLE_LETTER_DATA } from "../lib/letterTemplateComponents";
import PhotoUploader from "../components/PhotoUploader";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ height: 128, border: 1, borderColor: "grey.300", borderRadius: 1, p: 2, bgcolor: "grey.50" }}>
        <Typography color="text.secondary">Chargement…</Typography>
      </Box>
    ),
  }
);
import "react-quill-new/dist/quill.snow.css";

// ─── Keyframes ────────────────────────────────────────────────────
const modalSlideIn = keyframes`from{transform:translateY(-40px);opacity:0}to{transform:translateY(0);opacity:1}`;
const scaleIn = keyframes`from{transform:scale(0)}to{transform:scale(1)}`;

// ─── Styled Components ────────────────────────────────────────────
const MainContainer = styled(Box)({ height: "100vh", backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column", overflow: "hidden" });

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1, display: "flex", overflow: "hidden",
  padding: theme.spacing(2), gap: theme.spacing(3),
  [theme.breakpoints.up("md")]: { padding: theme.spacing(3) },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: "100%", height: "100%", overflowY: "auto", paddingRight: theme.spacing(1),
  display: "flex", flexDirection: "column",
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
  "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: 4, "&:hover": { background: "#a1a1a1" } },
  [theme.breakpoints.up("md")]: { width: "50%" },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: "none", height: "100%", flexDirection: "column",
  [theme.breakpoints.up("md")]: { display: "flex", width: "50%" },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3), marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex", justifyContent: "space-between", alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ToggleBtn = styled(IconButton)(({ theme }) => ({
  width: 32, height: 32, backgroundColor: theme.palette.grey[100],
  "&:hover": { backgroundColor: theme.palette.grey[200] },
}));

const TemplatePreviewWrapper = styled(Box)(({ theme }) => ({
  flex: 1, overflowY: "auto", overflowX: "hidden", backgroundColor: theme.palette.grey[200],
  borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
  padding: theme.spacing(2), display: "flex", justifyContent: "center", alignItems: "flex-start",
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: 4 },
}));

const LetterPrintRoot = styled(Box)({
  width: "210mm", maxWidth: "210mm", backgroundColor: "white",
  margin: "0 auto", boxSizing: "border-box", position: "relative",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)",
});

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), display: "flex", justifyContent: "center", gap: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: "white",
  borderRadius: `0 0 ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px`,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
  backgroundColor: "white", borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)", padding: theme.spacing(4),
  maxWidth: 400, width: "90%", animation: `${modalSlideIn} 0.3s ease-out`, outline: "none",
}));

const SuccessIconBox = styled(Box)(({ theme }) => ({
  width: 64, height: 64, backgroundColor: theme.palette.success.light, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  marginBottom: theme.spacing(2), animation: `${scaleIn} 0.5s ease-out`,
}));

const ErrorIconBox = styled(Box)(({ theme }) => ({
  width: 64, height: 64, backgroundColor: theme.palette.error.light, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: theme.spacing(2),
}));

const LoadingContainer = styled(Box)({
  minHeight: "100vh", background: "linear-gradient(135deg,#e3f2fd 0%,#e8eaf6 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
});

const LoadingCircle = styled(Box)({ position: "relative", width: 128, height: 128, marginBottom: 32 });

const LoadingRing = styled(Box)(({ progress }) => ({
  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
  borderRadius: "50%", border: "4px solid #000000", borderTopColor: "transparent",
  borderRightColor: "transparent", transform: `rotate(${(progress || 0) * 3.6}deg)`,
  transition: "transform 0.15s linear", opacity: (progress || 0) > 0 ? 1 : 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": { backgroundColor: theme.palette.grey[50], borderRadius: 8 },
}));

const SelectionCard = styled(Box)(({ theme }) => ({
  flex: 1, minHeight: 110, borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.grey[300]}`, backgroundColor: theme.palette.grey[50],
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  gap: theme.spacing(1), cursor: "pointer", transition: "all 0.2s ease",
  "&:hover": { borderColor: "#000000", backgroundColor: "#00000008", transform: "translateY(-2px)" },
}));

// ─── Quill wrapper (matches CV Builder styling) ───────────────────
const QuillWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  "& .ql-toolbar": {
    borderRadius: "8px 8px 0 0",
  },
  "& .ql-container": {
    borderRadius: "0 0 8px 8px",
    minHeight: 200,
  },
}));

const FONT_OPTIONS = [
  { value: '"Dancing Script", cursive', label: "Cursive" },
  { value: "Georgia, serif",            label: "Georgia" },
  { value: '"Times New Roman", serif',  label: "Times New Roman" },
  { value: "Arial, sans-serif",         label: "Arial" },
];

const LETTER_FONTS = [
  { value: "inherit",                          label: "Par défaut" },
  { value: "'Helvetica Neue', Arial, sans-serif", label: "Helvetica" },
  { value: "'Times New Roman', serif",         label: "Times New Roman" },
  { value: "Georgia, serif",                   label: "Georgia" },
  { value: "Garamond, serif",                  label: "Garamond" },
  { value: "Verdana, sans-serif",              label: "Verdana" },
  { value: "Palatino, serif",                  label: "Palatino" },
];

const FONT_SIZE_MAP  = { XS: "0.70rem", S: "0.82rem", M: "0.92rem", L: "1.04rem", XL: "1.18rem" };
const LINE_HEIGHT_OPTS = ["1", "1.15", "1.25", "1.5", "2"];
const PAGE_MARGIN_MAP = { XS: "4mm", S: "8mm", M: "14mm", L: "20mm", XL: "28mm" };

// ─── Default letter data ──────────────────────────────────────────
const DEFAULT_SIG = { data: "", type: "draw", font: '"Dancing Script", cursive', align: "left", size: "M", color: "#000000" };

const EMPTY_LETTER = {
  senderInfo: { photo: null, firstName: "", lastName: "", title: "", useJobTitleAsTitle: false, email: "", phone: "", address: "", city: "" },
  recipientInfo: { company: "", contact: "", address: "", city: "" },
  content: { ville: "", date: "", objet: "", formule: "", corps: "" },
  signature: DEFAULT_SIG,
};

const EMPTY_OFFER = { title: "", poste: "", entreprise: "", remuneration: "", ville: "", coordonnees: "", etape: "mes_offres" };

const SECTIONS = [
  { id: "personalInfo", title: "Informations personnelles", icon: <PersonIcon /> },
  { id: "recipient",    title: "Destinataire",              icon: <BusinessIcon /> },
  { id: "content",      title: "Contenu",                   icon: <ArticleIcon /> },
];

// ─── Local draft persistence (survives page refresh) ─────────────
const LETTER_DRAFT_PREFIX = "cvtify_letter_draft_";
const getLetterDraftKey = (id) => `${LETTER_DRAFT_PREFIX}${id || "new"}`;

// ─── Component ───────────────────────────────────────────────────
function MotivationLetterBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useAuth();
  const { getLetter, createLetter, updateLetter, exportDocx } = useLetterBuilderApi();
  const { generateText, isGenerating } = useAiAssist();
  const { createDownloadHistory } = useDownloads({ autoFetch: false });

  // Loading
  const [isLoading, setIsLoading]         = useState(true);
  const [isDataLoaded, setIsDataLoaded]   = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Save / download
  const [isSaving, setIsSaving]           = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal]     = useState(false);
  const [errorMessage, setErrorMessage]         = useState("");
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);        // preview-panel button
  const [sidebarDlAnchor, setSidebarDlAnchor]   = useState(null);        // sidebar bottom button
  const downloadButtonRef = useRef(null);

  // Letter
  const urlLetterId  = searchParams.get("id");
  const urlTemplate  = searchParams.get("template");
  const [letterId, setLetterId]                   = useState(urlLetterId || null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(Number(urlTemplate) || 1);
  const [selectedSection, setSelectedSection]       = useState("personalInfo");
  const [letterData, setLetterData]                 = useState(EMPTY_LETTER);

  // Header
  const [langAnchor, setLangAnchor]     = useState(null);
  const [selectedLang, setSelectedLang] = useState("FR");

  // Section ⋮ menus
  const [emailNumericToggle, setEmailNumericToggle]           = useState(false);
  const [contentMenuAnchor, setContentMenuAnchor]             = useState(null);
  const [personalInfoMenuAnchor, setPersonalInfoMenuAnchor]   = useState(null);
  const [recipientMenuAnchor, setRecipientMenuAnchor]         = useState(null);

  // Footer toolbar
  const [selectedFont, setSelectedFont]       = useState("inherit");
  const [fontSize, setFontSize]               = useState("M");
  const [lineHeight, setLineHeight]           = useState("1.15");
  const [pageMargin, setPageMargin]           = useState("M");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [modeleAnchor, setModeleAnchor]       = useState(null);
  const [policeAnchor, setPoliceAnchor]       = useState(null);
  const [dimensionAnchor, setDimensionAnchor] = useState(null);

  // Quill (matches CV Builder pattern)
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
  const quillFormats = useMemo(
    () => ["header", "bold", "italic", "underline", "strike", "list", "link", "align"],
    []
  );

  // Preview scaling
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);

  // Signature
  const sigCanvasRef   = useRef(null);
  const sigUploadRef   = useRef(null);
  const letterPrintRef = useRef(null);
  const [isDrawing, setIsDrawing]               = useState(false);
  const [hasDrawnOnCanvas, setHasDrawnOnCanvas] = useState(false);
  const [sigMenuAnchor, setSigMenuAnchor]       = useState(null);
  const [tailleOpen, setTailleOpen]             = useState(false);
  // Signature modal
  const [sigModalOpen, setSigModalOpen]         = useState(false);
  const [sigModalTab, setSigModalTab]           = useState(0);   // 0=Dessiner 1=Taper 2=Télécharger
  const [sigColor, setSigColor]                 = useState("#000000");
  const [sigTypedText, setSigTypedText]         = useState("");
  const [sigUploadPreview, setSigUploadPreview] = useState(null);

  // CV selection
  const { parseCvFile } = useCvBuilderApi();
  const [cvModalOpen, setCvModalOpen]     = useState(false);
  const [cvModalStep, setCvModalStep]     = useState("select");
  const [cvSearchQuery, setCvSearchQuery] = useState("");
  const [selectedCv, setSelectedCv]       = useState(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const cvFileInputRef = useRef(null);
  const { cvs, loading: cvsLoading } = useMyCvs({ search: cvSearchQuery });

  // LinkedIn
  const [linkedinModalOpen, setLinkedinModalOpen] = useState(false);
  const [linkedinUrl, setLinkedinUrl]             = useState("");

  // Offers
  const [offerModalOpen, setOfferModalOpen]   = useState(false);
  const [offerSidebarOpen, setOfferSidebarOpen] = useState(false);
  const [offers, setOffers]     = useState([]);
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER);

  // Undo / Redo
  const historyRef      = useRef([EMPTY_LETTER]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef   = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Auto-save status
  const [saveStatus, setSaveStatus]       = useState("idle"); // "idle"|"saving"|"saved"|"error"
  const autoSaveTimerRef                  = useRef(null);
  const isInitialDataRef                  = useRef(true);
  const draftSaveTimerRef                 = useRef(null);

  // Header three-dot menu
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue]           = useState("");
  const [customTitle, setCustomTitle]           = useState("");
  const [isDuplicating, setIsDuplicating]       = useState(false);

  // ── Helpers ───────────────────────────────────────────────────
  const showError = useCallback((msg) => { setErrorMessage(msg); setShowErrorModal(true); }, []);

  const updateSenderInfo    = (f, v) => setLetterData(p => ({ ...p, senderInfo:    { ...p.senderInfo,    [f]: v } }));
  const updateRecipientInfo = (f, v) => setLetterData(p => ({ ...p, recipientInfo: { ...p.recipientInfo, [f]: v } }));
  const updateContent       = (f, v) => setLetterData(p => ({ ...p, content:       { ...(p.content || {}), [f]: v } }));
  const updateSig           = (changes) => setLetterData(p => ({ ...p, signature: { ...(p.signature || DEFAULT_SIG), ...changes } }));

  // ── Canvas drawing ────────────────────────────────────────────
  const startDraw = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = sigColor; ctx.lineWidth = 2; ctx.lineCap = "round";
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const stopDraw = () => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (canvas) { canvas.getContext("2d").closePath(); setHasDrawnOnCanvas(true); }
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnOnCanvas(false);
  };

  // When the Dessiner tab opens, size the canvas and reload any existing drawing
  useEffect(() => {
    if (!sigModalOpen || sigModalTab !== 0) return;
    setTimeout(() => {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  || 500;
      canvas.height = rect.height || 120;
      const sig = letterData.signature;
      if (sig?.type === "draw" && sig.data) {
        const img = new Image();
        img.onload = () => {
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasDrawnOnCanvas(true);
        };
        img.src = sig.data;
      } else {
        setHasDrawnOnCanvas(false);
      }
    }, 100);
  }, [sigModalOpen, sigModalTab]);

  // Scale preview to container width (no horizontal scroll)
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const LETTER_W = 794; // ~210mm at 96dpi
    const compute = () => setPreviewScale(Math.min(1, (el.clientWidth - 32) / LETTER_W));
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Undo/Redo history (immediate — one change per entry) ─────
  useEffect(() => {
    if (isUndoRedoRef.current) { isUndoRedoRef.current = false; return; }
    if (!isDataLoaded) return;
    const last = historyRef.current[historyIndexRef.current];
    if (JSON.stringify(last) !== JSON.stringify(letterData)) {
      historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), letterData];
      if (historyRef.current.length > 200) historyRef.current.shift();
      else historyIndexRef.current++;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterData, isDataLoaded]);

  // ── Auto-save (2 s debounce) ──────────────────────────────────
  useEffect(() => {
    if (!isDataLoaded) return;
    if (isInitialDataRef.current) { isInitialDataRef.current = false; return; }
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const draftKeyBeforeSave = getLetterDraftKey(letterId);
      try {
        const { firstName, lastName } = letterData.senderInfo;
        const derivedTitle = [firstName, lastName].filter(Boolean).join(" ")
          ? `${[firstName, lastName].filter(Boolean).join(" ")} – Lettre de motivation`
          : "Ma Lettre de motivation";
        const title = customTitle || derivedTitle;
        const payload = { title, template_id: selectedTemplateId, ...letterData };
        if (letterId) {
          await updateLetter(letterId, payload);
        } else {
          const r = await createLetter(payload);
          const newId = r?.id || r?.letter?.id;
          if (newId) {
            setLetterId(String(newId));
            const p = new URLSearchParams(searchParams);
            p.set("id", String(newId));
            router.replace(`?${p.toString()}`, { scroll: false });
          }
        }
        localStorage.removeItem(draftKeyBeforeSave);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, 2000);
    return () => clearTimeout(autoSaveTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterData, selectedTemplateId, isDataLoaded]);

  // ── Data fetch ────────────────────────────────────────────────
  useEffect(() => {
    const fetchLetter = async () => {
      // Recover any unsaved edits left over from before a refresh
      let draftLetterData = null;
      let draftTemplateId = null;
      try {
        const draftRaw = localStorage.getItem(getLetterDraftKey(letterId));
        if (draftRaw) {
          const draft = JSON.parse(draftRaw);
          draftLetterData = draft?.letterData || null;
          draftTemplateId = draft?.selectedTemplateId || null;
        }
      } catch (e) {
        // Corrupt/unavailable draft — ignore and continue as normal
      }

      if (!letterId) {
        if (draftLetterData) setLetterData(prev => ({ ...EMPTY_LETTER, ...prev, ...draftLetterData }));
        if (draftTemplateId) setSelectedTemplateId(Number(draftTemplateId));
        setIsDataLoaded(true);
        return;
      }

      try {
        const data = await getLetter(letterId);
        if (draftTemplateId) {
          setSelectedTemplateId(Number(draftTemplateId));
        } else if (data.templateId) {
          setSelectedTemplateId(Number(data.templateId));
        }
        setLetterData(prev => ({ ...EMPTY_LETTER, ...prev, ...data, ...draftLetterData }));
      } catch (err) {
        showError(err?.message || "Impossible de charger la lettre.");
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchLetter();
  }, [letterId]);

  // Debounced local backup of unsaved edits, so a refresh never loses data
  useEffect(() => {
    if (!isDataLoaded) return;
    if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);
    draftSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          getLetterDraftKey(letterId),
          JSON.stringify({ letterData, selectedTemplateId, savedAt: Date.now() })
        );
      } catch (e) {
        // localStorage unavailable/full — unsaved-draft backup is best-effort
      }
    }, 500);
    return () => clearTimeout(draftSaveTimerRef.current);
  }, [letterData, selectedTemplateId, letterId, isDataLoaded]);

  // ── Loading progress ──────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) return;
    const iv = setInterval(() => {
      setLoadingProgress(prev => {
        if (!isDataLoaded && prev >= 90) return 90;
        if (prev >= 100) { clearInterval(iv); setTimeout(() => setIsLoading(false), 200); return 100; }
        return prev + (isDataLoaded ? 5 : 1);
      });
    }, 20);
    return () => clearInterval(iv);
  }, [isLoading, isDataLoaded]);

  // ── CV handlers ───────────────────────────────────────────────
  const handleCloseCvModal  = () => { setCvModalOpen(false); setCvModalStep("select"); };
  const applyCvToSenderInfo = (cv) => {
    const p = cv?.personalInfo;
    if (!p) return;
    setLetterData(prev => ({
      ...prev,
      senderInfo: {
        ...prev.senderInfo,
        photo: p.profileImage || prev.senderInfo.photo,
        firstName: p.firstName || prev.senderInfo.firstName,
        lastName: p.lastName || prev.senderInfo.lastName,
        title: p.title || prev.senderInfo.title,
        email: p.email || prev.senderInfo.email,
        phone: p.phoneNumber || prev.senderInfo.phone,
        address: p.address || prev.senderInfo.address,
        city: p.city || prev.senderInfo.city,
      },
    }));
  };
  const handleSelectCv      = (cv) => { setSelectedCv(cv); applyCvToSenderInfo(cv); handleCloseCvModal(); };
  const handleCreateNewCv   = () => { handleCloseCvModal(); router.push("/templates"); };
  const handleCvFileSelected = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setIsUploadingCv(true);
    try {
      const r = await parseCvFile(file);
      const cv = r?.cv || r;
      setSelectedCv(cv);
      applyCvToSenderInfo(cv);
      handleCloseCvModal();
    }
    catch (err) { showError(err?.message || "Échec de l'import."); }
    finally { setIsUploadingCv(false); }
  };

  // ── Offer handlers ────────────────────────────────────────────
  const updateOfferForm = (f, v) => setOfferForm(p => ({ ...p, [f]: v }));
  const handleSaveOffer = () => { setOffers(p => [...p, { id: Date.now(), ...offerForm }]); setOfferSidebarOpen(false); setOfferModalOpen(true); };

  // ── Section reset handlers ────────────────────────────────────
  const handleResetPersonalInfo = () => {
    setLetterData(p => ({ ...p, senderInfo: EMPTY_LETTER.senderInfo }));
    setPersonalInfoMenuAnchor(null);
  };
  const handleResetRecipient = () => {
    setLetterData(p => ({ ...p, recipientInfo: EMPTY_LETTER.recipientInfo }));
    setRecipientMenuAnchor(null);
  };
  const handleResetContent = () => {
    setLetterData(p => ({ ...p, content: EMPTY_LETTER.content, signature: DEFAULT_SIG }));
    setContentMenuAnchor(null);
  };

  // ── Undo / Redo ───────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current--;
    setLetterData(historyRef.current[historyIndexRef.current]);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current++;
    setLetterData(historyRef.current[historyIndexRef.current]);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // ── Duplicate letter ──────────────────────────────────────────
  const handleDuplicate = useCallback(async () => {
    setIsDuplicating(true);
    try {
      const { firstName, lastName } = letterData.senderInfo;
      const baseTitle = customTitle || ([firstName, lastName].filter(Boolean).join(" ")
        ? `${[firstName, lastName].filter(Boolean).join(" ")} – Lettre de motivation`
        : "Ma Lettre de motivation");
      const r = await createLetter({ title: `${baseTitle} - Copie`, template_id: selectedTemplateId, ...letterData });
      const newId = r?.id || r?.letter?.id;
      if (newId) router.push(`/motivation-letter-builder?id=${newId}`);
    } catch (err) {
      showError(err?.message || "Échec de la duplication.");
    } finally {
      setIsDuplicating(false);
      setHeaderMenuAnchor(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterData, customTitle, selectedTemplateId]);

  // ── Signature modal handlers ──────────────────────────────────
  const handleOpenSigModal = useCallback((tab = 0) => {
    const sig = letterData.signature;
    setSigModalTab(tab);
    setSigColor(sig?.color || "#000000");
    setSigTypedText(sig?.type === "type" ? (sig.data || "") : "");
    setSigUploadPreview(sig?.type === "upload" ? (sig.data || null) : null);
    setHasDrawnOnCanvas(false);
    setSigModalOpen(true);
  }, [letterData.signature]);

  const handleOpenModifier = useCallback(() => {
    const sig = letterData.signature;
    const tab = sig?.type === "upload" ? 2 : sig?.type === "type" ? 1 : 0;
    handleOpenSigModal(tab);
    setSigMenuAnchor(null);
  }, [letterData.signature, handleOpenSigModal]);

  const handleSigTermine = () => {
    if (sigModalTab === 0) {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      updateSig({ data: canvas.toDataURL(), type: "draw", color: sigColor });
    } else if (sigModalTab === 1) {
      updateSig({ data: sigTypedText.trim(), type: "type", color: sigColor });
    } else {
      if (sigUploadPreview) updateSig({ data: sigUploadPreview, type: "upload", color: sigColor });
    }
    setSigModalOpen(false);
  };

  const handleSigFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSigUploadPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteSig = () => {
    updateSig({ ...DEFAULT_SIG, data: "" });
    setSigMenuAnchor(null);
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSaveLetter = async () => {
    setIsSaving(true);
    const draftKeyBeforeSave = getLetterDraftKey(letterId);
    try {
      const { firstName, lastName } = letterData.senderInfo;
      const payload = {
        title: [firstName, lastName].filter(Boolean).join(" ") + " – Lettre de motivation" || "Ma Lettre de motivation",
        template_id: selectedTemplateId,
        ...letterData,
      };
      let response;
      if (letterId) {
        response = await updateLetter(letterId, payload);
      } else {
        response = await createLetter(payload);
        setLetterId(response.id);
        const p = new URLSearchParams(searchParams);
        p.set("id", response.id);
        router.replace(`?${p.toString()}`, { scroll: false });
      }
      localStorage.removeItem(draftKeyBeforeSave);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      return response;
    } catch (err) {
      showError(err?.message || "Échec de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── PDF download ──────────────────────────────────────────────
  const handleDownloadPDF = useCallback(async () => {
    const el = letterPrintRef.current;
    if (!el) return showError("Aperçu introuvable.");
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH  = (canvas.height / canvas.width) * pageW;
      if (imgH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
      } else {
        let yOffset = 0;
        while (yOffset < imgH) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, -yOffset, pageW, imgH);
          yOffset += pageH;
        }
      }
      const { firstName = "", lastName = "" } = letterData.senderInfo;
      pdf.save(`lettre-${[firstName, lastName].filter(Boolean).join("-") || "motivation"}.pdf`);

      if (letterId) {
        createDownloadHistory({
          type: "letter",
          downloadableId: Number(letterId),
          format: "PDF",
        }).catch(() => {});
      }
    } catch (err) {
      showError(err?.message || "Échec du téléchargement PDF.");
    }
  }, [letterId, letterData.senderInfo, showError]);

  // ── DOCX download ─────────────────────────────────────────────
  const handleDownloadDOCX = async () => {
    try {
      let id = letterId;
      if (!id) { const r = await handleSaveLetter(); id = r?.id; }
      if (!id) return showError("Sauvegardez d'abord.");
      const blob = await exportDocx(id);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "LettreDeMotivaion.docx";
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);

      createDownloadHistory({
        type: "letter",
        downloadableId: Number(id),
        format: "DOCX",
      }).catch(() => {});
    } catch (err) {
      showError(err?.message || "Échec du téléchargement DOCX.");
    } finally {
      setDownloadAnchorEl(null);
      setSidebarDlAnchor(null);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleAiGenerate = async () => {
    const c = letterData.content || {};
    const existingText = stripHtml(c.corps);
    try {
      const html = await generateText({
        contentType: "additional_section",
        sectionLabel: "Lettre de motivation",
        mode: existingText ? "improve" : "generate",
        existingText,
        context: {
          title: letterData.senderInfo?.title,
          recipientCompany: letterData.recipientInfo?.company,
          subject: c.objet,
        },
      });
      updateContent("corps", html);
    } catch (err) {
      showError(err?.message || "Échec de la génération IA.");
    }
  };

  // ── Template data mapping ─────────────────────────────────────
  const buildTemplateData = () => {
    const c   = letterData.content || {};
    const sig = letterData.signature || DEFAULT_SIG;
    return {
      ...letterData,
      senderInfo: { ...letterData.senderInfo, date: [c.ville, c.date].filter(Boolean).join(", ") },
      recipientInfo: { ...letterData.recipientInfo, firstName: letterData.recipientInfo?.contact || "", lastName: "", position: "" },
      subject: c.objet || "",
      opening: c.formule || "",
      body: c.corps || "",
      closing: "",
      signature: { signature: sig.data || null, signatureType: sig.data ? sig.type : null },
    };
  };

  const letterSx = {
    fontSize: FONT_SIZE_MAP[fontSize],
    "& p, & span, & div, & li": { lineHeight },
    ...(selectedFont !== "inherit" && { "& *": { fontFamily: `${selectedFont} !important` } }),
  };

  const renderPreview = () => {
    const C = letterTemplateComponents[selectedTemplateId];
    if (!C) return null;
    return (
      <Box sx={{ width: "210mm", zoom: previewScale }}>
        <LetterPrintRoot ref={letterPrintRef} id="letter-pdf-content" sx={letterSx}>
          <C letterData={buildTemplateData()} />
        </LetterPrintRoot>
      </Box>
    );
  };

  // ── Section renderers ─────────────────────────────────────────
  const renderPersonalInfo = () => (
    <Box>
      <Box sx={{ mb: 2 }}>
        <PhotoUploader
          profileImage={letterData.senderInfo.photo}
          onProfileImageChange={(img) => updateSenderInfo("photo", img)}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StyledTextField fullWidth size="small" label="Prénom"
            value={letterData.senderInfo.firstName || ""}
            onChange={e => updateSenderInfo("firstName", e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <StyledTextField fullWidth size="small" label="Nom de famille"
            value={letterData.senderInfo.lastName || ""}
            onChange={e => updateSenderInfo("lastName", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <StyledTextField sx={{ mb: 0, flex: 1 }} size="small" label="Emploi recherché"
              value={letterData.senderInfo.title || ""}
              onChange={e => updateSenderInfo("title", e.target.value)} />
            <FormControlLabel
              control={<Switch checked={letterData.senderInfo.useJobTitleAsTitle || false} onChange={e => updateSenderInfo("useJobTitleAsTitle", e.target.checked)} size="small" />}
              label={<Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>En faire le titre du CV</Typography>}
              sx={{ ml: 0.5, mr: 0, mt: 0.5 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <StyledTextField fullWidth size="small" label="Adresse e-mail" type="email"
            value={letterData.senderInfo.email || ""}
            onChange={e => updateSenderInfo("email", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField fullWidth size="small" label="Numéro de téléphone" type="tel"
            value={letterData.senderInfo.phone || ""}
            onChange={e => updateSenderInfo("phone", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField fullWidth size="small" label="Adresse"
            value={letterData.senderInfo.address || ""}
            onChange={e => updateSenderInfo("address", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField fullWidth size="small" label="Ville"
            value={letterData.senderInfo.city || ""}
            onChange={e => updateSenderInfo("city", e.target.value)} />
        </Grid>
      </Grid>
    </Box>
  );

  const renderRecipient = () => (
    <Grid container spacing={2}>
      {[{ f: "company", l: "Entreprise" }, { f: "contact", l: "Contact" }, { f: "address", l: "Adresse" }, { f: "city", l: "Ville" }].map(({ f, l }) => (
        <Grid item xs={12} key={f}>
          <StyledTextField fullWidth size="small" label={l}
            value={letterData.recipientInfo[f] || ""}
            onChange={e => updateRecipientInfo(f, e.target.value)} />
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = () => {
    const c   = letterData.content  || {};
    const sig = letterData.signature || DEFAULT_SIG;
    const sigHeights   = { S: 40, M: 60, L: 80 };
    const sigFontSizes = { S: 18, M: 24, L: 32 };

    return (
      <Box>

        {/* Ville + Date */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyledTextField
              fullWidth size="small" label="Ville"
              value={c.ville || ""}
              onChange={e => updateContent("ville", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <StyledTextField
              fullWidth size="small" label="Date" type="date"
              value={c.date || ""}
              onChange={e => updateContent("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Objet */}
        <StyledTextField
          fullWidth size="small" label="Objet"
          value={c.objet || ""}
          onChange={e => updateContent("objet", e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Formule d'appel */}
        <StyledTextField
          fullWidth size="small" label="Formule d'appel"
          placeholder="Madame, Monsieur,"
          value={c.formule || ""}
          onChange={e => updateContent("formule", e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Contenu label */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1, mb: 0.5 }}>
          Contenu
        </Typography>

        <QuillWrapper>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={(c.corps || "").replace(/>\s+</g, "><")}
            onChange={val => updateContent("corps", val)}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Rédigez votre lettre ici…"
            className="custom-quill"
          />
        </QuillWrapper>

        {/* ── Signature area ── */}
        <Box sx={{ mt: 1, mb: 1 }}>
          {sig.data ? (
            <Box>
              {/* Signature display + 3-dot */}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Box sx={{
                  flex: 1,
                  border: "1px dashed #d0d0d0",
                  borderRadius: 1,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sig.align === "center" ? "center" : sig.align === "right" ? "flex-end" : "flex-start",
                  minHeight: (sigHeights[sig.size || "M"] || 60) + 16,
                }}>
                  {(sig.type === "draw" || sig.type === "upload") ? (
                    <img
                      src={sig.data}
                      alt="Signature"
                      style={{ height: sigHeights[sig.size || "M"] || 60, objectFit: "contain", display: "block" }}
                    />
                  ) : (
                    <Typography sx={{
                      fontFamily: sig.font || '"Dancing Script", cursive',
                      fontSize: sigFontSizes[sig.size || "M"] || 24,
                      color: sig.color || "#000000",
                      lineHeight: 1.2,
                    }}>
                      {sig.data}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={e => { setSigMenuAnchor(e.currentTarget); setTailleOpen(false); }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Police & Alignment */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <Select
                  size="small"
                  value={sig.font || FONT_OPTIONS[0].value}
                  onChange={e => updateSig({ font: e.target.value })}
                  sx={{ flex: 1, fontSize: "0.82rem" }}
                >
                  {FONT_OPTIONS.map(f => (
                    <MenuItem key={f.value} value={f.value} sx={{ fontFamily: f.value }}>{f.label}</MenuItem>
                  ))}
                </Select>
                {[
                  { icon: <FormatAlignLeftIcon fontSize="small" />,   align: "left"   },
                  { icon: <FormatAlignCenterIcon fontSize="small" />, align: "center" },
                  { icon: <FormatAlignRightIcon fontSize="small" />,  align: "right"  },
                ].map(({ icon, align }) => (
                  <IconButton
                    key={align}
                    size="small"
                    onClick={() => updateSig({ align })}
                    sx={{ color: (sig.align || "left") === align ? "primary.main" : "text.secondary" }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: "none", borderStyle: "dashed", color: "text.secondary", borderColor: "grey.400" }}
                onClick={() => handleOpenSigModal(0)}
              >
                + Ajouter une signature
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                size="small"
                variant="contained"
                disabled={isGenerating}
                onClick={handleAiGenerate}
                startIcon={isGenerating ? <CircularProgress size={14} sx={{ color: "white" }} /> : null}
                sx={{
                  textTransform: "none",
                  fontSize: "0.78rem",
                  whiteSpace: "nowrap",
                  background: "linear-gradient(135deg,#000000,#1a1a1a)",
                  color: "white !important",
                  "&.Mui-disabled": { background: "linear-gradient(135deg,#000000,#1a1a1a)", color: "white", opacity: 0.7 },
                }}
              >
                {isGenerating ? "Génération..." : "✨ Générer avec l'IA"}
              </Button>
            </Stack>
          )}
        </Box>

        {/* Signature 3-dot menu */}
        <Menu
          anchorEl={sigMenuAnchor}
          open={Boolean(sigMenuAnchor)}
          onClose={() => { setSigMenuAnchor(null); setTailleOpen(false); }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleOpenModifier}>Modifier</MenuItem>
          <MenuItem onClick={() => setTailleOpen(t => !t)}>
            <ListItemText>Taille de la signature</ListItemText>
            {tailleOpen ? <ExpandLessIcon fontSize="small" sx={{ ml: 1 }} /> : <ExpandMoreIcon fontSize="small" sx={{ ml: 1 }} />}
          </MenuItem>
          <Collapse in={tailleOpen}>
            <Box sx={{ display: "flex", gap: 1, px: 2, py: 1 }}>
              {["S", "M", "L"].map(s => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  onClick={() => updateSig({ size: s })}
                  variant={(sig.size || "M") === s ? "filled" : "outlined"}
                  color={(sig.size || "M") === s ? "primary" : "default"}
                  sx={{ cursor: "pointer", minWidth: 36 }}
                />
              ))}
            </Box>
          </Collapse>
          <MenuItem onClick={handleDeleteSig} sx={{ color: "error.main" }}>Supprimer</MenuItem>
        </Menu>

      </Box>
    );
  };

  const renderSectionContent = (id) => {
    if (id === "personalInfo") return renderPersonalInfo();
    if (id === "recipient")    return renderRecipient();
    if (id === "content")      return renderContent();
    return null;
  };

  // ── Loading screen ────────────────────────────────────────────
  if (isLoading) {
    return (
      <LoadingContainer>
        <Box textAlign="center">
          <LoadingCircle>
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "50%", border: 4, borderColor: "primary.light" }} />
            <LoadingRing progress={loadingProgress} />
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">{loadingProgress}%</Typography>
            </Box>
          </LoadingCircle>
          <Typography variant="h5" fontWeight="bold">Chargement…</Typography>
        </Box>
      </LoadingContainer>
    );
  }

  // ── Header title ─────────────────────────────────────────────
  const headerTitle = customTitle || (() => {
    const { firstName, lastName } = letterData.senderInfo;
    const name = [firstName, lastName].filter(Boolean).join(" ");
    return name ? `${name} – Lettre de motivation` : "Ma Lettre de motivation";
  })();

  // ── Main Render ───────────────────────────────────────────────
  return (
    <MainContainer>

      {/* ══ TOP HEADER ══ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          py: 0.75,
          bgcolor: "#111827",
          color: "white",
          flexShrink: 0,
          minHeight: 52,
          gap: 1,
        }}
      >
        {/* Left: back button */}
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            fontSize: { xs: "0.78rem", sm: "0.875rem" },
            whiteSpace: "nowrap",
            minWidth: 0,
            px: { xs: 1, sm: 1.5 },
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Lettres de motivation
          </Box>
        </Button>

        {/* Center: title + cloud save */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flex: 1,
            justifyContent: "center",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            noWrap
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "0.78rem", sm: "0.875rem" },
              maxWidth: { xs: 140, sm: 300, md: 460 },
            }}
          >
            {headerTitle}
          </Typography>
          <Box
            title={saveStatus === "saving" ? "Sauvegarde en cours…" : saveStatus === "saved" ? "Sauvegardé" : saveStatus === "error" ? "Erreur de sauvegarde" : "Sauvegarde automatique"}
            sx={{ display: "flex", alignItems: "center", p: 0.5, cursor: "default" }}
          >
            {saveStatus === "saving" ? (
              <CircularProgress size={16} sx={{ color: "rgba(255,255,255,0.55)" }} />
            ) : (
              <Box sx={{ position: "relative", display: "inline-flex", color: saveStatus === "saved" ? "rgba(74,222,128,0.9)" : saveStatus === "error" ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.55)" }}>
                <Cloud size={16} />
                {saveStatus === "saved" && (
                  <Box sx={{ position: "absolute", bottom: -2, right: -2, width: 9, height: 9, borderRadius: "50%", bgcolor: "rgba(74,222,128,1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={6} color="#fff" />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: actions */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 0.5 }}>
          {/* Undo */}
          <IconButton
            size="small"
            title="Annuler"
            onClick={handleUndo}
            disabled={!canUndo}
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" }, "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" }, display: { xs: "none", md: "flex" } }}
          >
            <Undo2 size={16} />
          </IconButton>
          {/* Redo */}
          <IconButton
            size="small"
            title="Rétablir"
            onClick={handleRedo}
            disabled={!canRedo}
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" }, "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" }, display: { xs: "none", md: "flex" } }}
          >
            <Redo2 size={16} />
          </IconButton>

          {/* Language selector */}
          <Button
            size="small"
            startIcon={<Languages size={15} />}
            endIcon={<ExpandMoreIcon sx={{ fontSize: "16px !important" }} />}
            onClick={e => setLangAnchor(e.currentTarget)}
            sx={{
              color: "rgba(255,255,255,0.85)",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8rem",
              px: { xs: 0.75, sm: 1 },
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 1.5,
              minWidth: 0,
              display: { xs: "none", sm: "flex" },
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            {selectedLang}
          </Button>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { mt: 0.5, minWidth: 120 } }}
          >
            {["FR", "EN", "ES", "DE"].map(lang => (
              <MenuItem
                key={lang}
                selected={selectedLang === lang}
                onClick={() => { setSelectedLang(lang); setLangAnchor(null); }}
                sx={{ fontSize: "0.875rem" }}
              >
                {lang}
              </MenuItem>
            ))}
          </Menu>

          {/* Three-dot menu */}
          <IconButton
            size="small"
            onClick={e => setHeaderMenuAnchor(e.currentTarget)}
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={headerMenuAnchor}
            open={Boolean(headerMenuAnchor)}
            onClose={() => setHeaderMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { mt: 0.5, minWidth: 160 } }}
          >
            <MenuItem onClick={() => { setRenameValue(headerTitle); setRenameDialogOpen(true); setHeaderMenuAnchor(null); }}>
              Renommer
            </MenuItem>
            <MenuItem onClick={handleDuplicate} disabled={isDuplicating}>
              {isDuplicating ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
              Dupliquer
            </MenuItem>
          </Menu>

          {/* Download button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon fontSize="small" />}
            endIcon={<ExpandMoreIcon sx={{ fontSize: "14px !important" }} />}
            onClick={e => setDownloadAnchorEl(e.currentTarget)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              px: { xs: 1.25, sm: 1.75 },
              bgcolor: "#000000",
              "&:hover": { bgcolor: "#5a6fd6" },
              whiteSpace: "nowrap",
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Télécharger</Box>
          </Button>
          <Menu
            anchorEl={downloadAnchorEl}
            open={Boolean(downloadAnchorEl)}
            onClose={() => setDownloadAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { mt: 0.5 } }}
          >
            <MenuItem onClick={() => { handleDownloadPDF(); setDownloadAnchorEl(null); }}>
              <ListItemText>PDF</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleDownloadDOCX(); setDownloadAnchorEl(null); }}>
              <ListItemText>DOCX</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      <ContentContainer>

        {/* ══ LEFT SIDEBAR ══ */}
        <SidebarContainer>
          {/* Scrollable content */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2} sx={{ pb: 2 }}>

              {/* CV & Offer selection */}
              <SectionCard elevation={1}>
                <Stack direction="row" spacing={2}>
                  <SelectionCard onClick={() => { setCvModalStep("select"); setCvModalOpen(true); }}>
                    <FileText size={28} color="#000000" />
                    <Typography variant="body2" fontWeight={600}>Sélectionner le CV</Typography>
                    {selectedCv && <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: "90%" }}>{selectedCv.title}</Typography>}
                  </SelectionCard>
                  <SelectionCard onClick={() => setOfferModalOpen(true)}>
                    <Briefcase size={28} color="#000000" />
                    <Typography variant="body2" fontWeight={600}>Sélectionner l&apos;offre</Typography>
                    {offers.length > 0 && <Typography variant="caption" color="text.secondary">{offers.length} offre{offers.length > 1 ? "s" : ""}</Typography>}
                  </SelectionCard>
                </Stack>
              </SectionCard>

              {/* Section cards */}
              {SECTIONS.map(section => (
                <SectionCard key={section.id} elevation={1}>
                  <SectionHeader>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ color: "primary.main" }}>{section.icon}</Box>
                      <Typography variant="h6" fontWeight="600">{section.title}</Typography>
                    </Stack>
                    {section.id === "content" ? (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton size="small" onClick={e => setContentMenuAnchor(e.currentTarget)}>
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <ToggleBtn size="small" onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}>
                          {selectedSection === section.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ToggleBtn>
                      </Stack>
                    ) : (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={e => section.id === "personalInfo"
                            ? setPersonalInfoMenuAnchor(e.currentTarget)
                            : setRecipientMenuAnchor(e.currentTarget)
                          }
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <ToggleBtn size="small" onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}>
                          {selectedSection === section.id ? <RemoveIcon /> : <AddIcon />}
                        </ToggleBtn>
                      </Stack>
                    )}
                  </SectionHeader>
                  <Collapse in={selectedSection === section.id}>
                    <Divider sx={{ mb: 2 }} />
                    {renderSectionContent(section.id)}
                  </Collapse>
                </SectionCard>
              ))}
              {/* Informations personnelles ⋮ menu */}
              <Menu
                anchorEl={personalInfoMenuAnchor}
                open={Boolean(personalInfoMenuAnchor)}
                onClose={() => setPersonalInfoMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleResetPersonalInfo}>Réinitialiser</MenuItem>
              </Menu>

              {/* Destinataire ⋮ menu */}
              <Menu
                anchorEl={recipientMenuAnchor}
                open={Boolean(recipientMenuAnchor)}
                onClose={() => setRecipientMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleResetRecipient}>Réinitialiser</MenuItem>
              </Menu>

              {/* Contenu ⋮ menu */}
              <Menu
                anchorEl={contentMenuAnchor}
                open={Boolean(contentMenuAnchor)}
                onClose={() => setContentMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleResetContent}>Réinitialiser</MenuItem>
              </Menu>
            </Stack>
          </Box>

          {/* ── Bottom bar: Télécharger (desktop) / Aperçu (mobile) ── */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1, pb: 2, pr: 1 }}>
            {/* Mobile: Aperçu button */}
            <Button
              variant="contained"
              onClick={() => setMobilePreviewOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, textTransform: "none" }}
            >
              Aperçu
            </Button>
            {/* Desktop: Télécharger dropup */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={e => setSidebarDlAnchor(e.currentTarget)}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              Télécharger
            </Button>
            <Menu
              anchorEl={sidebarDlAnchor}
              open={Boolean(sidebarDlAnchor)}
              onClose={() => setSidebarDlAnchor(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <MenuItem onClick={() => { handleDownloadPDF(); setSidebarDlAnchor(null); }}>
                <ListItemText>PDF</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDownloadDOCX}>
                <ListItemText>DOCX</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </SidebarContainer>

        {/* ══ RIGHT PREVIEW ══ */}
        <PreviewContainer>
          <Paper elevation={1} sx={{ display: "flex", flexDirection: "column", height: "100%", borderRadius: 3, overflow: "hidden" }}>
            <TemplatePreviewWrapper ref={previewContainerRef}>{renderPreview()}</TemplatePreviewWrapper>

            {/* ── Footer toolbar ── */}
            <ActionButtonsContainer sx={{ justifyContent: "space-between", px: { md: 1, lg: 2 }, gap: 0 }}>
              <Stack direction="row" spacing={0} alignItems="center">

                {/* Modèle */}
                <Button
                  size="small"
                  endIcon={<ExpandLessIcon sx={{ fontSize: "14px !important" }} />}
                  onClick={e => setModeleAnchor(e.currentTarget)}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: { md: "0.7rem", lg: "0.82rem" }, px: { md: 0.75, lg: 1.25 }, minWidth: 0 }}
                >
                  Modèle
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: { md: 0.25, lg: 0.5 }, my: 0.5 }} />

                {/* Police */}
                <Button
                  size="small"
                  endIcon={<ExpandLessIcon sx={{ fontSize: "14px !important" }} />}
                  onClick={e => setPoliceAnchor(e.currentTarget)}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: { md: "0.7rem", lg: "0.82rem" }, px: { md: 0.75, lg: 1.25 }, minWidth: 0 }}
                >
                  Police
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: { md: 0.25, lg: 0.5 }, my: 0.5 }} />

                {/* Dimensionnement */}
                <Button
                  size="small"
                  endIcon={<ExpandLessIcon sx={{ fontSize: "14px !important" }} />}
                  onClick={e => setDimensionAnchor(e.currentTarget)}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: { md: "0.7rem", lg: "0.82rem" }, px: { md: 0.75, lg: 1.25 }, minWidth: 0 }}
                >
                  <Box component="span" sx={{ display: { md: "none", lg: "inline" } }}>Dimension</Box>
                  <Box component="span" sx={{ display: { md: "inline", lg: "none" } }}>Dim.</Box>
                </Button>

              </Stack>

              {/* Fullscreen toggle */}
              <IconButton size="small" onClick={() => setFullscreenPreview(f => !f)} title={fullscreenPreview ? "Quitter le plein écran" : "Plein écran"}>
                {fullscreenPreview ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </ActionButtonsContainer>
          </Paper>
        </PreviewContainer>
      </ContentContainer>

      {/* ── Modèle dropup ── */}
      <Popover
        open={Boolean(modeleAnchor)}
        anchorEl={modeleAnchor}
        onClose={() => setModeleAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{ sx: { borderRadius: 2, p: 2 } }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Choisir un modèle</Typography>
        <Stack direction="row" spacing={1.5}>
          {LETTER_TEMPLATE_LIST.map(({ id, name }) => {
            const active = selectedTemplateId === id;
            const ThumbTemplate = letterTemplateComponents[id];
            return (
              <Box
                key={id}
                title={name}
                onClick={() => { setSelectedTemplateId(id); setModeleAnchor(null); }}
                sx={{
                  width: 82,
                  border: "2px solid",
                  borderColor: active ? "#000000" : "grey.300",
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: active ? "#0000000d" : "grey.50",
                  overflow: "hidden",
                  transition: "all 0.15s",
                  "&:hover": { borderColor: "#000000", bgcolor: "#00000008" },
                }}
              >
                {/* Mini live preview of the real template */}
                <Box sx={{ height: 100, overflow: "hidden", bgcolor: "#ffffff" }}>
                  <Box sx={{ width: "794px", transform: "scale(0.1)", transformOrigin: "top left", pointerEvents: "none" }}>
                    {ThumbTemplate && <ThumbTemplate letterData={SAMPLE_LETTER_DATA} />}
                  </Box>
                </Box>
                <Box sx={{ borderTop: "1px solid", borderColor: "grey.200", py: 0.5, textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    noWrap
                    fontWeight={active ? 700 : 400}
                    color={active ? "primary" : "text.secondary"}
                    sx={{ display: "block", px: 0.5, fontSize: "0.65rem" }}
                  >
                    {name}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Popover>

      {/* ── Police dropup ── */}
      <Popover
        open={Boolean(policeAnchor)}
        anchorEl={policeAnchor}
        onClose={() => setPoliceAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{ sx: { borderRadius: 2, py: 0.5, minWidth: 200 } }}
      >
        {LETTER_FONTS.map(f => (
          <MenuItem
            key={f.value}
            selected={selectedFont === f.value}
            onClick={() => { setSelectedFont(f.value); setPoliceAnchor(null); }}
            sx={{ fontFamily: f.value, fontSize: "0.95rem" }}
          >
            {f.label}
          </MenuItem>
        ))}
      </Popover>

      {/* ── Dimensionnement dropup ── */}
      <Popover
        open={Boolean(dimensionAnchor)}
        anchorEl={dimensionAnchor}
        onClose={() => setDimensionAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{ sx: { borderRadius: 2, p: 2.5, minWidth: 310 } }}
      >
        {/* Taille de police */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.8} sx={{ display: "block", mb: 1 }}>
          TAILLE DE POLICE
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ mb: 2.5 }}>
          {["XS", "S", "M", "L", "XL"].map(s => {
            const on = fontSize === s;
            return (
              <Box key={s} onClick={() => setFontSize(s)} sx={{ flex: 1, py: 0.75, textAlign: "center", borderRadius: 1, cursor: "pointer", border: "1px solid", borderColor: on ? "#000000" : "grey.300", bgcolor: on ? "#000000" : "transparent", color: on ? "white" : "text.primary", fontSize: "0.78rem", fontWeight: on ? 700 : 400, transition: "all 0.12s", "&:hover": { borderColor: "#000000" } }}>
                {s}
              </Box>
            );
          })}
        </Stack>

        {/* Hauteur de ligne */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.8} sx={{ display: "block", mb: 1 }}>
          HAUTEUR DE LIGNE
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ mb: 2.5 }}>
          {LINE_HEIGHT_OPTS.map(h => {
            const on = lineHeight === h;
            return (
              <Box key={h} onClick={() => setLineHeight(h)} sx={{ flex: 1, py: 0.75, textAlign: "center", borderRadius: 1, cursor: "pointer", border: "1px solid", borderColor: on ? "#000000" : "grey.300", bgcolor: on ? "#000000" : "transparent", color: on ? "white" : "text.primary", fontSize: "0.72rem", fontWeight: on ? 700 : 400, transition: "all 0.12s", "&:hover": { borderColor: "#000000" } }}>
                {h}
              </Box>
            );
          })}
        </Stack>

        {/* Marge de page */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.8} sx={{ display: "block", mb: 1 }}>
          MARGE DE PAGE
        </Typography>
        <Stack direction="row" spacing={0.75}>
          {["XS", "S", "M", "L", "XL"].map(m => {
            const on = pageMargin === m;
            return (
              <Box key={m} onClick={() => setPageMargin(m)} sx={{ flex: 1, py: 0.75, textAlign: "center", borderRadius: 1, cursor: "pointer", border: "1px solid", borderColor: on ? "#000000" : "grey.300", bgcolor: on ? "#000000" : "transparent", color: on ? "white" : "text.primary", fontSize: "0.78rem", fontWeight: on ? 700 : 400, transition: "all 0.12s", "&:hover": { borderColor: "#000000" } }}>
                {m}
              </Box>
            );
          })}
        </Stack>
      </Popover>

      {/* ── Fullscreen preview overlay ── */}
      {fullscreenPreview && (
        <Box sx={{
          position: "fixed", inset: 0, zIndex: 1400,
          bgcolor: "grey.300",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Scrollable letter area */}
          <Box sx={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            display: "flex", justifyContent: "center", alignItems: "flex-start",
            pt: 3, pb: 1, px: 2,
          }}>
            {(() => {
              const C = letterTemplateComponents[selectedTemplateId];
              return C ? (
                <Box sx={{ width: "210mm", zoom: "min(1, calc((100vw - 64px) / 794px))" }}>
                  <LetterPrintRoot sx={letterSx}>
                    <C letterData={buildTemplateData()} />
                  </LetterPrintRoot>
                </Box>
              ) : null;
            })()}
          </Box>

          {/* Footer toolbar — same as normal preview */}
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 2, py: 1,
            bgcolor: "white", borderTop: "1px solid", borderColor: "divider",
            flexShrink: 0,
          }}>
            <Stack direction="row" spacing={0.5}>
              <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setModeleAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Modèle</Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setPoliceAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Police</Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setDimensionAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Dimensionnement</Button>
            </Stack>
            <IconButton size="small" onClick={() => setFullscreenPreview(false)} title="Quitter le plein écran">
              <FullscreenExitIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Success modal */}
      <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: "blur(5px)" } } }}>
        <Fade in={showSuccessModal}>
          <ModalContent>
            <Stack alignItems="center">
              <SuccessIconBox><CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} /></SuccessIconBox>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>Lettre sauvegardée !</Typography>
              <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                Votre lettre a été {letterId ? "mise à jour" : "créée"} avec succès.
              </Typography>
              <Button variant="contained" onClick={() => setShowSuccessModal(false)} sx={{ px: 4 }}>Continuer</Button>
            </Stack>
          </ModalContent>
        </Fade>
      </Modal>

      {/* Error modal */}
      <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: "blur(5px)" } } }}>
        <Fade in={showErrorModal}>
          <ModalContent>
            <Stack alignItems="center">
              <ErrorIconBox><ErrorIcon sx={{ fontSize: 40, color: "error.main" }} /></ErrorIconBox>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>Une erreur est survenue</Typography>
              <Typography color="text.secondary" textAlign="center" sx={{ mb: 3, maxHeight: 120, overflowY: "auto", fontSize: "0.85rem", fontFamily: "monospace", bgcolor: "grey.50", p: 1, borderRadius: 1, width: "100%" }}>
                {errorMessage}
              </Typography>
              <Button variant="contained" color="error" onClick={() => setShowErrorModal(false)} sx={{ px: 4 }}>Fermer</Button>
            </Stack>
          </ModalContent>
        </Fade>
      </Modal>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Renommer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            sx={{ mt: 1 }}
            onKeyDown={e => {
              if (e.key === "Enter" && renameValue.trim()) {
                setCustomTitle(renameValue.trim());
                setRenameDialogOpen(false);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameDialogOpen(false)} sx={{ textTransform: "none" }}>Annuler</Button>
          <Button
            variant="contained"
            disabled={!renameValue.trim()}
            onClick={() => { setCustomTitle(renameValue.trim()); setRenameDialogOpen(false); }}
            sx={{ textTransform: "none" }}
          >
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      {/* CV Selection Modal */}
      <Dialog open={cvModalOpen} onClose={handleCloseCvModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <Box sx={{ overflow: "hidden" }}>
          <Box sx={{ display: "flex", width: "200%", transform: cvModalStep === "select" ? "translateX(0)" : "translateX(-50%)", transition: "transform 0.35s ease" }}>
            <Box sx={{ width: "50%", flexShrink: 0 }}>
              <DialogTitle sx={{ fontWeight: 700 }}>Sélectionner le CV</DialogTitle>
              <DialogContent>
                <TextField fullWidth size="small" placeholder="Rechercher…" value={cvSearchQuery} onChange={e => setCvSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }} sx={{ mb: 2 }} />
                {cvsLoading ? <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress size={28} /></Box>
                  : cvs.length === 0 ? <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>Aucun CV trouvé</Typography>
                  : <List sx={{ maxHeight: 280, overflowY: "auto" }}>
                      {cvs.map(cv => (
                        <ListItemButton key={cv.id} onClick={() => handleSelectCv(cv)} sx={{ borderRadius: 2, mb: 0.5 }}>
                          <ListItemIcon><FileText size={20} color="#000000" /></ListItemIcon>
                          <ListItemText primary={cv.title} secondary={`Modifié ${cv.lastEdited}`} />
                        </ListItemButton>
                      ))}
                    </List>}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
                <Button startIcon={<UploadCloud size={16} />} onClick={() => setCvModalStep("upload")} sx={{ textTransform: "none" }}>Téléchargez votre CV</Button>
                <Button variant="contained" startIcon={<Plus size={16} />} onClick={handleCreateNewCv} sx={{ textTransform: "none" }}>Créer un nouveau CV</Button>
              </DialogActions>
            </Box>
            <Box sx={{ width: "50%", flexShrink: 0 }}>
              <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => setCvModalStep("select")}><ArrowLeft size={18} /></IconButton>
                Téléchargez votre CV
              </DialogTitle>
              <DialogContent sx={{ pb: 3 }}>
                <Box onClick={() => cvFileInputRef.current?.click()}
                  sx={{ border: "2px dashed", borderColor: "grey.300", borderRadius: 2, textAlign: "center", py: 5, px: 2, cursor: "pointer", "&:hover": { borderColor: "#000000", bgcolor: "#00000008" } }}>
                  {isUploadingCv ? <CircularProgress size={32} /> : <><FileText size={48} color="#94a3b8" style={{ marginBottom: 12 }} /><Typography color="text.secondary">Glissez votre document ici ou cliquez.</Typography></>}
                </Box>
                <input ref={cvFileInputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleCvFileSelected} />
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button fullWidth variant="outlined" startIcon={<UploadCloud size={16} />} onClick={() => cvFileInputRef.current?.click()} sx={{ textTransform: "none" }}>Télécharger</Button>
                  <Button fullWidth variant="outlined" startIcon={<Link2 size={16} />} onClick={() => setLinkedinModalOpen(true)} sx={{ textTransform: "none" }}>Importer LinkedIn</Button>
                </Stack>
              </DialogContent>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* LinkedIn Modal */}
      <Dialog open={linkedinModalOpen} onClose={() => setLinkedinModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          <Link2 size={20} color="#0a66c2" /> Importer LinkedIn
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth size="small" placeholder="https://www.linkedin.com/in/username" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setLinkedinModalOpen(false); setLinkedinUrl(""); }} sx={{ textTransform: "none", color: "#64748b" }}>Annuler</Button>
          <Button variant="contained" onClick={() => { setLinkedinModalOpen(false); setLinkedinUrl(""); handleCloseCvModal(); }} disabled={!linkedinUrl.trim()} sx={{ textTransform: "none" }}>Importer</Button>
        </DialogActions>
      </Dialog>

      {/* Offer Modal */}
      <Dialog open={offerModalOpen} onClose={() => setOfferModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Sélectionner l&apos;offre</DialogTitle>
        <DialogContent>
          {offers.length === 0
            ? <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>Aucune offre pour le moment</Typography>
            : <List>{offers.map(o => (
                <ListItemButton key={o.id} sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon><Briefcase size={20} color="#000000" /></ListItemIcon>
                  <ListItemText primary={o.poste || o.title || "Offre sans titre"} secondary={o.entreprise} />
                </ListItemButton>
              ))}</List>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button fullWidth variant="contained" startIcon={<Plus size={16} />} onClick={() => { setOfferForm(EMPTY_OFFER); setOfferModalOpen(false); setOfferSidebarOpen(true); }} sx={{ textTransform: "none" }}>
            Ajouter une offre
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Mobile preview Drawer (slide from right) ── */}
      <Drawer
        anchor="right"
        open={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        PaperProps={{ sx: { width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" } }}
        sx={{ display: { md: "none" } }}
      >
        {/* Scrollable letter */}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", bgcolor: "grey.200", display: "flex", justifyContent: "center", alignItems: "flex-start", py: 2, px: 1 }}>
          <Box sx={{ width: "210mm", zoom: "min(1, calc((100vw - 16px) / 794px))" }}>
            {(() => {
              const C = letterTemplateComponents[selectedTemplateId];
              return C ? (
                <LetterPrintRoot sx={letterSx}><C letterData={buildTemplateData()} /></LetterPrintRoot>
              ) : null;
            })()}
          </Box>
        </Box>
        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, bgcolor: "white", borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          <Stack direction="row" spacing={0.5}>
            <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setModeleAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Modèle</Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setPoliceAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Police</Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Button size="small" endIcon={<ExpandLessIcon fontSize="small" />} onClick={e => setDimensionAnchor(e.currentTarget)} sx={{ textTransform: "none", fontWeight: 600 }}>Dimensionnement</Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" variant="contained" startIcon={<DownloadIcon />} endIcon={<ExpandMoreIcon />} onClick={e => setSidebarDlAnchor(e.currentTarget)} sx={{ textTransform: "none" }}>Télécharger</Button>
            <IconButton size="small" onClick={() => setMobilePreviewOpen(false)}><X size={18} /></IconButton>
          </Stack>
        </Box>
      </Drawer>

      {/* ── Signature Modal ── */}
      <Dialog
        open={sigModalOpen}
        onClose={() => setSigModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
          Signature
          <IconButton size="small" onClick={() => setSigModalOpen(false)}><X size={18} /></IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs value={sigModalTab} onChange={(_, v) => setSigModalTab(v)}>
            <Tab label="Dessiner" />
            <Tab label="Taper" />
            <Tab label="Télécharger" />
          </Tabs>
        </Box>

        <DialogContent sx={{ pt: 2, pb: 1, minHeight: 200 }}>
          {/* ── Dessiner ── */}
          {sigModalTab === 0 && (
            <Box>
              <Box sx={{ position: "relative", border: "1px solid #e0e0e0", borderRadius: 1, overflow: "hidden", bgcolor: "#fafafa" }}>
                <canvas
                  ref={sigCanvasRef}
                  style={{ width: "100%", height: 150, display: "block", cursor: "crosshair", touchAction: "none" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                />
                <Button
                  size="small"
                  onClick={clearCanvas}
                  sx={{ position: "absolute", top: 4, right: 4, textTransform: "none", fontSize: "0.72rem", color: "text.secondary", bgcolor: "white", minWidth: 0, px: 1, py: 0.25, border: "1px solid #e0e0e0", borderRadius: 1 }}
                >
                  Effacer
                </Button>
              </Box>
            </Box>
          )}

          {/* ── Taper ── */}
          {sigModalTab === 1 && (
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Tapez votre signature ici…"
              value={sigTypedText}
              onChange={e => setSigTypedText(e.target.value)}
              inputProps={{ style: { fontFamily: '"Dancing Script", cursive', fontSize: 26, color: sigColor, lineHeight: 1.4 } }}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fafafa" } }}
            />
          )}

          {/* ── Télécharger ── */}
          {sigModalTab === 2 && (
            <Box>
              <Box
                onClick={() => sigUploadRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  handleSigFileUpload(e.dataTransfer.files?.[0]);
                }}
                sx={{
                  border: "2px dashed",
                  borderColor: sigUploadPreview ? "primary.main" : "grey.300",
                  borderRadius: 2,
                  textAlign: "center",
                  py: 4,
                  px: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  bgcolor: sigUploadPreview ? "#00000008" : "transparent",
                  "&:hover": { borderColor: "primary.main", bgcolor: "#00000008" },
                }}
              >
                {sigUploadPreview ? (
                  <img src={sigUploadPreview} alt="signature uploadée" style={{ maxHeight: 100, maxWidth: "100%", objectFit: "contain" }} />
                ) : (
                  <>
                    <UploadCloud size={40} color="#94a3b8" style={{ marginBottom: 8 }} />
                    <Typography color="text.secondary" sx={{ mb: 2, fontSize: "0.9rem" }}>
                      Faites glisser et déposez votre image ici ou cliquez pour la télécharger
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
                      Télécharger l&apos;image
                    </Button>
                  </>
                )}
              </Box>
              <input
                ref={sigUploadRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => handleSigFileUpload(e.target.files?.[0])}
              />
              {sigUploadPreview && (
                <Button size="small" color="error" onClick={() => setSigUploadPreview(null)} sx={{ mt: 1, textTransform: "none" }}>
                  Supprimer l&apos;image
                </Button>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", borderTop: "1px solid #f0f0f0" }}>
          {/* Color swatches */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {[
              { hex: "#000000", label: "Noir" },
              { hex: "#1565C0", label: "Bleu" },
              { hex: "#C62828", label: "Rouge" },
            ].map(({ hex, label }) => (
              <Box
                key={hex}
                title={label}
                onClick={() => setSigColor(hex)}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: hex,
                  cursor: "pointer",
                  border: sigColor === hex ? "3px solid white" : "2px solid transparent",
                  outline: `2px solid ${sigColor === hex ? hex : "transparent"}`,
                  transition: "all 0.15s",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              />
            ))}
          </Box>

          {/* Terminé */}
          <Button
            variant="contained"
            onClick={handleSigTermine}
            disabled={
              sigModalTab === 0 ? !hasDrawnOnCanvas :
              sigModalTab === 1 ? !sigTypedText.trim() :
              !sigUploadPreview
            }
            sx={{ textTransform: "none", px: 3 }}
          >
            Terminé
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offer Sidebar */}
      <Drawer anchor="right" open={offerSidebarOpen} onClose={() => setOfferSidebarOpen(false)} PaperProps={{ sx: { width: 340 } }}>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Briefcase size={20} color="#000000" />
            <Typography variant="h6" fontWeight="700">Offre d&apos;emploi</Typography>
            <IconButton size="small" onClick={() => setOfferSidebarOpen(false)} sx={{ ml: "auto" }}><X size={18} /></IconButton>
          </Stack>
          {[{ f:"title",l:"Titre de l'offre",I:Tag},{f:"poste",l:"Poste",I:Briefcase},{f:"entreprise",l:"Entreprise",I:Building2},{f:"remuneration",l:"Rémunération",I:Euro},{f:"ville",l:"Ville",I:MapPin},{f:"coordonnees",l:"Coordonnées",I:Phone}].map(({f,l,I}) => (
            <TextField key={f} variant="standard" label={l} fullWidth value={offerForm[f]} onChange={e => updateOfferForm(f, e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><I size={16} /></InputAdornment> }} sx={{ mb: 2.5 }} />
          ))}
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}><ListChecks size={16} /> Étape</Typography>
          <Select variant="standard" fullWidth value={offerForm.etape} onChange={e => updateOfferForm("etape", e.target.value)}>
            {[["mes_offres","Mes offres"],["candidature_envoyee","Candidature envoyée"],["entretien","Entretien"],["proposition_embauche","Proposition d'embauche"],["candidature_rejetee","Candidature rejetée"],["embauche","Embauché(e)"]].map(([v,l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
          </Select>
          <Box sx={{ mt: "auto", pt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button color="error" startIcon={<Trash2 size={16} />} onClick={() => setOfferSidebarOpen(false)} sx={{ textTransform: "none" }}>Supprimer</Button>
            <Button variant="contained" startIcon={<Check size={16} />} onClick={handleSaveOffer} sx={{ textTransform: "none" }}>Terminé</Button>
          </Box>
        </Box>
      </Drawer>
    </MainContainer>
  );
}

export default function MotivationLetterBuilderPage() {
  return (
    <Suspense fallback={null}>
      <MotivationLetterBuilder />
    </Suspense>
  );
}
