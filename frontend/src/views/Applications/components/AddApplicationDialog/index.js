import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Alert } from '@material-ui/lab';
import { Button } from 'components/Button';
import { createApplication } from 'services/applications';
import { listEnvironments } from 'services/environments';
import styles from './style.module.scss';

const AddApplicationDialog = ({ open, onClose, onSuccess, organizations }) => {
  const [formData, setFormData] = useState({
    name: '',
    organisationId: '',
    environmentIds: [],
    metadata: {}
  });
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEnvironments, setLoadingEnvironments] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        name: '',
        organisationId: '',
        environmentIds: [],
        metadata: {}
      });
      setEnvironments([]);
      setError('');
    }
  }, [open]);

  useEffect(() => {
    if (formData.organisationId) {
      fetchEnvironments(formData.organisationId);
    } else {
      setEnvironments([]);
      setFormData(prev => ({ ...prev, environmentIds: [] }));
    }
  }, [formData.organisationId]);

  const fetchEnvironments = async (organisationId) => {
    try {
      setLoadingEnvironments(true);
      setError('');
      const response = await listEnvironments(organisationId);
      if (!response.isError) {
        setEnvironments(response.data || []);
      } else {
        setError(response.message);
        setEnvironments([]);
      }
    } catch (error) {
      setError('Failed to fetch environments');
      setEnvironments([]);
    } finally {
      setLoadingEnvironments(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnvironmentChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      environmentIds: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Application name is required');
      return;
    }

    if (!formData.organisationId) {
      setError('Please select an organization');
      return;
    }

    if (formData.environmentIds.length === 0) {
      setError('Please select at least one environment');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await createApplication(formData);
      
      if (!response.isError) {
        onSuccess();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle>Add New Application</DialogTitle>
      
      <DialogContent className={styles.dialog__content}>
        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Application Name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={loading}
        />

        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Organization</InputLabel>
          <Select
            value={formData.organisationId}
            onChange={(e) => handleInputChange('organisationId', e.target.value)}
            label="Organization"
            disabled={loading}
          >
            {organizations.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Environments</InputLabel>
          <Select
            multiple
            value={formData.environmentIds}
            onChange={handleEnvironmentChange}
            input={<OutlinedInput label="Environments" />}
            renderValue={(selected) => selected.join(', ')}
            disabled={loading || loadingEnvironments || !formData.organisationId}
          >
            {environments.map((env) => (
              <MenuItem key={env.id} value={env.id}>
                <Checkbox checked={formData.environmentIds.indexOf(env.id) > -1} />
                <ListItemText primary={env.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loadingEnvironments && (
          <div className={styles.dialog__loading}>
            Loading environments...
          </div>
        )}

        {formData.organisationId && environments.length === 0 && !loadingEnvironments && (
          <div className={styles.dialog__noEnvironments}>
            No environments found for this organization
          </div>
        )}
      </DialogContent>

      <DialogActions className={styles.dialog__actions}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !formData.name.trim() || !formData.organisationId || formData.environmentIds.length === 0}
        >
          {loading ? 'Creating...' : 'Create Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddApplicationDialog;
