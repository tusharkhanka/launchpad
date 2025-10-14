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

const AddRoleDialog = ({ open, onClose, onCreateRole }) => {
  const [formData, setFormData] = useState({
    name: ''
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
    if (!formData.name.trim()) {
      setError('Please enter a role name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onCreateRole(formData);
      setFormData({ name: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '' });
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
        Create New Role
      </DialogTitle>
      
      <DialogContent className={styles.dialogContent}>
        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        
        <TextField
          fullWidth
          label="Role Name"
          value={formData.name}
          onChange={handleChange('name')}
          margin="normal"
          variant="outlined"
          disabled={loading}
          className={styles.textField}
          placeholder="e.g., Developer, Designer, Manager"
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
          {loading ? 'Creating...' : 'Create Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoleDialog;
