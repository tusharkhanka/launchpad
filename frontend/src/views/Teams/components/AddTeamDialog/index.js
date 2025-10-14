import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import styles from './style.module.scss';

const AddTeamDialog = ({ open, onClose, onCreateTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onCreateTeam(formData);
      setFormData({ name: '', email: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', email: '' });
      setError('');
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
      <DialogTitle className={styles.dialogTitle}>
        Create New Team
      </DialogTitle>
      
      <DialogContent className={styles.dialogContent}>
        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        
        <TextField
          fullWidth
          label="Team Name"
          value={formData.name}
          onChange={handleChange('name')}
          margin="normal"
          variant="outlined"
          disabled={loading}
          className={styles.textField}
        />
        
        <TextField
          fullWidth
          label="Team Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          margin="normal"
          variant="outlined"
          disabled={loading}
          className={styles.textField}
          helperText="This email will be used for team communications"
        />
      </DialogContent>
      
      <DialogActions className={styles.dialogActions}>
        <Button
          onClick={handleClose}
          disabled={loading}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          className={styles.createButton}
        >
          {loading ? 'Creating...' : 'Create Team'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeamDialog;
