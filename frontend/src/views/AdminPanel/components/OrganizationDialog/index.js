import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { createOrganization, updateOrganization, deleteOrganization } from "services/organizations";
import styles from "./style.module.scss";

const OrganizationDialog = ({ open, onClose, organization, mode, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (organization && mode === "edit") {
      setFormData({ name: organization.name || "" });
    } else {
      setFormData({ name: "" });
    }
    setError("");
  }, [organization, mode, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Organization name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      if (mode === "create") {
        response = await createOrganization({ name: formData.name.trim() });
      } else if (mode === "edit") {
        response = await updateOrganization(organization.id, { name: formData.name.trim() });
      }

      if (response && response.data) {
        onSuccess();
        onClose();
      } else {
        setError("Operation failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${organization.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteOrganization(organization.id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to delete organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create": return "Create Organization";
      case "edit": return "Edit Organization";
      case "delete": return "Delete Organization";
      default: return "Organization";
    }
  };

  const isDeleteMode = mode === "delete";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles["dialog__title"]}>
        {getTitle()}
      </DialogTitle>
      
      <DialogContent className={styles["dialog__content"]}>
        {error && (
          <Alert severity="error" className={styles["dialog__error"]}>
            {error}
          </Alert>
        )}

        {isDeleteMode ? (
          <div className={styles["dialog__delete-content"]}>
            <p>Are you sure you want to delete the organization <strong>"{organization?.name}"</strong>?</p>
            <p>This action will also delete all associated cloud accounts and environments. This cannot be undone.</p>
          </div>
        ) : (
          <TextField
            name="name"
            label="Organization Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            className={styles["dialog__input"]}
            placeholder="Enter organization name"
            disabled={loading}
          />
        )}
      </DialogContent>

      <DialogActions className={styles["dialog__actions"]}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {isDeleteMode ? (
          <Button
            onClick={handleDelete}
            disabled={loading}
            color="secondary"
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim()}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : (mode === "create" ? "Create" : "Update")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationDialog;
