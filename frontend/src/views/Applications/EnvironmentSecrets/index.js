import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "components/Button";
import AddIcon from "@material-ui/icons/Add";
import SecretsTable from "./components/SecretsTable";
import styles from "./style.module.scss";
import Loader from "components/Loader";
import { Alert } from "@material-ui/lab";
import {
  createTagForApplication,
  getApplicationSecrets,
  updateApplicationSecrets,
} from "services/applications";

const EnvironmentSecrets = () => {
  const { applicationName, environmentName } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [openAddKeyModal, setOpenAddKeyModal] = useState(false);
  const [openAddTagModal, setOpenAddTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createTag = async (applicationName, envName) => {
    if (!newTagName) {
      setError("Tag Name is required");
    } else {
      const data = { name: newTagName };
      const response = await createTagForApplication(applicationName, envName, data);
      if (!response.isError) {
        setError("");
        window.location.reload();
        setOpenAddTagModal(false);
      } else {
        setError(response.message);
        setOpenAddTagModal(false);
      }
    }
  };

  const getSecrets = async (applicationName, envName) => {
    const response = await getApplicationSecrets(applicationName, envName);
    if (!response.isError) {
      return response?.data;
    }
  };

  const createKey = async (applicationName, envName) => {
    if (!newKeyName.trim()) {
      setError("Key Name is required");
      return;
    }

    try {
      const secrets = await getSecrets(applicationName, envName);
      const secretsMapped = secrets?.map((ele) => {
        // Merge existing secret data with the new key
        const existingSecretData = ele?.secret_data?.secret || {};
        const mergedSecretData = {
          ...existingSecretData,
          [newKeyName]: "", // Add new key with empty value
        };

        const data = {
          tag_name: ele.tag_name,
          secret_data: {
            secret: mergedSecretData,
          },
        };
        return data;
      });

      const payload = { secrets: secretsMapped };
      const response = await updateApplicationSecrets(applicationName, envName, payload);
      
      if (!response.isError) {
        setError("");
        setSuccessMessage(`Key "${newKeyName}" added successfully!`);
        setNewKeyName(""); // Clear the input
        setOpenAddKeyModal(false);
        // Refresh to show the new key after a brief delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to add new key");
    }
  };

  const handleBackClick = () => {
    history.push(`/applications/${applicationName}`);
  };

  return (
    <div className={styles.environmentSecrets}>
      <div className={styles.environmentSecrets__header}>
        <Button onClick={handleBackClick} variant="outlined">
          ← Back to {applicationName}
        </Button>
        <h1>{applicationName} / {environmentName} / secrets</h1>
        <div className={styles.form__action__buttons}>
          <Button
            icon={<AddIcon />}
            onClick={() => {
              setOpenAddKeyModal(true);
            }}
          >
            Add Key
          </Button>
          <Button
            icon={<AddIcon />}
            onClick={() => {
              setOpenAddTagModal(true);
            }}
          >
            Add Tag
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className={styles.error__alert}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" className={styles.success__alert}>
          {successMessage}
        </Alert>
      )}

      {applicationName && (
        <SecretsTable
          applicationName={applicationName}
          env={environmentName}
          setLoading={setLoading}
          loading={loading}
        />
      )}

      {openAddKeyModal && (
        <div className={styles.environmentSecrets__modal}>
          <div className={styles.environmentSecrets__modalOverlay}>
            <div className={styles.environmentSecrets__modalBox}>
              <h3>Add New Key</h3>
              <div className={styles.environmentSecrets__formGroup}>
                <label>Key Name:</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter key name"
                  className={styles.environmentSecrets__input}
                />
              </div>
              <div className={styles.modal__actions}>
                <Button 
                  className={styles.modal__action}
                  onClick={() => createKey(applicationName, environmentName)}
                >
                  Save
                </Button>
                <Button
                  className={styles.modal__action}
                  variant="outlined"
                  onClick={() => setOpenAddKeyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openAddTagModal && (
        <div className={styles.environmentSecrets__modal}>
          <div className={styles.environmentSecrets__modalOverlay}>
            <div className={styles.environmentSecrets__modalBox}>
              <h3>Add New Tag</h3>
              <div className={styles.environmentSecrets__formGroup}>
                <label>Tag Name:</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className={styles.environmentSecrets__input}
                />
              </div>
              <div className={styles.modal__actions}>
                <Button 
                  className={styles.modal__action}
                  onClick={() => createTag(applicationName, environmentName)}
                >
                  Save
                </Button>
                <Button
                  className={styles.modal__action}
                  variant="outlined"
                  onClick={() => setOpenAddTagModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSecrets;