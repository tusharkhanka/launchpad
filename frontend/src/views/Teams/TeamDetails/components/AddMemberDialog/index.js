import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Autocomplete } from '@material-ui/lab';
import { searchUsersByEmail } from '../../../../../services/users';
import { listRoles } from '../../../../../services/roles';
import styles from './style.module.scss';

const AddMemberDialog = ({ open, onClose, onAddMember }) => {
  const [formData, setFormData] = useState({
    userId: null,
    roleId: null
  });
  const [emailSearch, setEmailSearch] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  useEffect(() => {
    if (emailSearch.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setUserSuggestions([]);
    }
  }, [emailSearch]);

  const fetchRoles = async () => {
    try {
      const response = await listRoles();
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const searchUsers = async () => {
    try {
      setSearching(true);
      const response = await searchUsersByEmail(emailSearch);
      setUserSuggestions(response.data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setUserSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.userId || !formData.roleId) {
      setError('Please select both user and role');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAddMember(formData);
      setFormData({ userId: null, roleId: null });
      setEmailSearch('');
      setUserSuggestions([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ userId: null, roleId: null });
      setEmailSearch('');
      setUserSuggestions([]);
      setError('');
      onClose();
    }
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      userId: user?.id || null
    }));
    setEmailSearch(user?.email || '');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      roleId: role?.id || null
    }));
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
        Add Member to Team
      </DialogTitle>
      
      <DialogContent className={styles.dialogContent}>
        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        
        <div className={styles.formGroup}>
          <Autocomplete
            freeSolo
            options={userSuggestions}
            getOptionLabel={(option) => option.email || ''}
            value={formData.userId ? userSuggestions.find(u => u.id === formData.userId) : null}
            onChange={(event, newValue) => handleUserSelect(newValue)}
            onInputChange={(event, newInputValue) => setEmailSearch(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="User Email"
                variant="outlined"
                margin="normal"
                fullWidth
                disabled={loading}
                className={styles.textField}
                placeholder="Type to search users..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searching ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(option) => (
              <Box>
                <div className={styles.userOption}>
                  <div className={styles.userEmail}>{option.email}</div>
                  {option.username && (
                    <div className={styles.userName}>{option.username}</div>
                  )}
                </div>
              </Box>
            )}
            loading={searching}
            noOptionsText={emailSearch.length < 2 ? "Type at least 2 characters to search" : "No users found"}
          />
        </div>

        <div className={styles.formGroup}>
          <Autocomplete
            options={roles}
            getOptionLabel={(option) => option.name || ''}
            value={formData.roleId ? roles.find(r => r.id === formData.roleId) : null}
            onChange={(event, newValue) => handleRoleSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Role"
                variant="outlined"
                margin="normal"
                fullWidth
                disabled={loading}
                className={styles.textField}
                placeholder="Select a role"
              />
            )}
            renderOption={(option) => (
              <div className={styles.roleOption}>
                {option.name}
              </div>
            )}
            noOptionsText="No roles available"
          />
        </div>
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
          disabled={loading || !formData.userId || !formData.roleId}
          className={styles.addButton}
        >
          {loading ? 'Adding...' : 'Add Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;
