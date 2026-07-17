'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import { Plus, Pencil, Trash2, Star, RefreshCw } from 'lucide-react';
import { adminResourceApi } from '../../services/api';

const RESOURCE_TABS = [
  { value: 'cv_guide', label: 'CV Guides' },
  { value: 'cover_letter_tip', label: 'Cover Letter Tips' },
  { value: 'interview_prep', label: 'Interview Prep' },
  { value: 'career_advice', label: 'Career Advice' },
  { value: 'faq', label: 'FAQ' },
];

const EMPTY_RESOURCE_FORM = {
  title: '', description: '', read_time: '', icon: '', category: '',
  is_featured: false, is_published: true,
};
const EMPTY_FAQ_FORM = { question: '', answer: '', is_active: true };

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState('cv_guide');

  const [resources, setResources] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [resourceForm, setResourceForm] = useState(EMPTY_RESOURCE_FORM);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isFaqTab = activeTab === 'faq';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (isFaqTab) {
        const res = await adminResourceApi.getFaqs();
        setFaqs(res.faqs || []);
      } else {
        const res = await adminResourceApi.getResources(activeTab);
        setResources(res.resources || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load content.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, isFaqTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Dialog handlers ──────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingItem(null);
    setResourceForm(EMPTY_RESOURCE_FORM);
    setFaqForm(EMPTY_FAQ_FORM);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    if (isFaqTab) {
      setFaqForm({ question: item.question, answer: item.answer, is_active: item.is_active });
    } else {
      setResourceForm({
        title: item.title,
        description: item.description || '',
        read_time: item.readTime || '',
        icon: item.icon || '',
        category: item.category || '',
        is_featured: item.isFeatured,
        is_published: item.isPublished,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isSaving) return;
    setDialogOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isFaqTab) {
        if (editingItem) {
          await adminResourceApi.updateFaq(editingItem.id, faqForm);
        } else {
          await adminResourceApi.createFaq(faqForm);
        }
      } else {
        const payload = { ...resourceForm, type: activeTab };
        if (editingItem) {
          await adminResourceApi.updateResource(editingItem.id, payload);
        } else {
          await adminResourceApi.createResource(payload);
        }
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (isFaqTab) {
        await adminResourceApi.deleteFaq(deleteTarget.id);
      } else {
        await adminResourceApi.deleteResource(deleteTarget.id);
      }
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete.');
    }
  };

  const handleTogglePublished = async (item) => {
    await adminResourceApi.togglePublished(item.id);
    fetchData();
  };

  const handleToggleFeatured = async (item) => {
    await adminResourceApi.toggleFeatured(item.id);
    fetchData();
  };

  const handleToggleFaqActive = async (item) => {
    await adminResourceApi.toggleFaqActive(item.id);
    fetchData();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">Resources</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the content shown on the public Resources page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {isFaqTab ? 'Add FAQ' : 'Add Resource'}
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
      >
        {RESOURCE_TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchData} startIcon={<RefreshCw size={16} />}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isFaqTab ? (
          faqs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>No FAQs yet.</Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id} hover>
                    <TableCell sx={{ maxWidth: 500 }}>
                      <Typography variant="body2" fontWeight="600" noWrap>{faq.question}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {faq.answer}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Switch checked={faq.is_active} onChange={() => handleToggleFaqActive(faq)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenEdit(faq)}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteTarget(faq)} sx={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : resources.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>No resources yet.</Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category / Read time</TableCell>
                <TableCell align="center">Featured</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ maxWidth: 400 }}>
                    <Typography variant="body2" fontWeight="600" noWrap>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {item.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {item.category && <Chip label={item.category} size="small" />}
                      {item.readTime && <Chip label={item.readTime} size="small" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleToggleFeatured(item)}>
                      <Star size={16} color={item.isFeatured ? '#f59e0b' : '#cbd5e1'} fill={item.isFeatured ? '#f59e0b' : 'none'} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Switch checked={item.isPublished} onChange={() => handleTogglePublished(item)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenEdit(item)}>
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(item)} sx={{ color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingItem ? 'Edit' : 'Add'} {isFaqTab ? 'FAQ' : RESOURCE_TABS.find((t) => t.value === activeTab)?.label}
        </DialogTitle>
        <DialogContent>
          {isFaqTab ? (
            <>
              <TextField
                fullWidth label="Question" sx={{ mt: 1, mb: 2 }}
                value={faqForm.question}
                onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))}
              />
              <TextField
                fullWidth multiline rows={4} label="Answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth label="Title" sx={{ mt: 1, mb: 2 }}
                value={resourceForm.title}
                onChange={(e) => setResourceForm((p) => ({ ...p, title: e.target.value }))}
              />
              <TextField
                fullWidth multiline rows={3} label="Description" sx={{ mb: 2 }}
                value={resourceForm.description}
                onChange={(e) => setResourceForm((p) => ({ ...p, description: e.target.value }))}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth label="Read time (e.g. 5 min read)"
                  value={resourceForm.read_time}
                  onChange={(e) => setResourceForm((p) => ({ ...p, read_time: e.target.value }))}
                />
                <TextField
                  fullWidth label="Category"
                  value={resourceForm.category}
                  onChange={(e) => setResourceForm((p) => ({ ...p, category: e.target.value }))}
                />
              </Box>
              <TextField
                fullWidth label="Icon (Person, Lightbulb, School, TrendingUp, ...)" sx={{ mb: 2 }}
                value={resourceForm.icon}
                onChange={(e) => setResourceForm((p) => ({ ...p, icon: e.target.value }))}
              />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={resourceForm.is_featured}
                    onChange={(e) => setResourceForm((p) => ({ ...p, is_featured: e.target.checked }))}
                  />
                  <Typography variant="body2">Featured</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={resourceForm.is_published}
                    onChange={(e) => setResourceForm((p) => ({ ...p, is_published: e.target.checked }))}
                  />
                  <Typography variant="body2">Published</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isSaving} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSaving}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {isSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete {isFaqTab ? 'FAQ' : 'Resource'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete{' '}
            <strong>{deleteTarget?.title || deleteTarget?.question}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
