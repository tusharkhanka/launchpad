import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Business, CheckCircle } from "@material-ui/icons";

import { createEnvironment } from "services/environments";
import styles from "./style.module.scss";

const EnvironmentSetup = ({ organizationId, cloudAccountId, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    vpc_id: "",
    metadata: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Environment name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const metadata = formData.metadata ? JSON.parse(formData.metadata) : null;
      
      const response = await createEnvironment(organizationId, {
        name: formData.name.trim(),
        region: formData.region.trim() || null,
        vpc_id: formData.vpc_id.trim() || null,
        cloud_account_id: cloudAccountId,
        metadata
      });

      if (response && response.data) {
        onComplete();
      } else {
        setError("Failed to create environment");
      }
    } catch (err) {
      console.error("Error creating environment:", err);
      setError(err.response?.data?.message || "Failed to create environment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles["environment-setup"]}>
      <Card className={styles["environment-setup__card"]}>
        <CardContent>
          <Box className={styles["environment-setup__header"]}>
            <Business className={styles["environment-setup__icon"]} />
            <Typography variant="h5" className={styles["environment-setup__title"]}>
              Create Environment
            </Typography>
          </Box>
          
          <Typography variant="body1" className={styles["environment-setup__description"]}>
            Environments are isolated spaces where you can deploy and manage your applications. 
            Each environment is connected to a cloud account and can have its own configuration.
          </Typography>

          <Box className={styles["environment-setup__success"]}>
            <CheckCircle className={styles["environment-setup__success-icon"]} />
            <Typography variant="body2" className={styles["environment-setup__success-text"]}>
              Cloud account connected successfully! Now let's create your first environment.
            </Typography>
          </Box>

          <Box className={styles["environment-setup__form"]}>
            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Environment Name *"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                className={styles["environment-setup__input"]}
                placeholder="e.g., production, staging, development"
              />
              
              <TextField
                name="region"
                label="Region"
                value={formData.region}
                onChange={handleInputChange}
                fullWidth
                className={styles["environment-setup__input"]}
                placeholder="e.g., us-east-1, eu-west-1"
              />

              <TextField
                name="vpc_id"
                label="VPC ID"
                value={formData.vpc_id}
                onChange={handleInputChange}
                fullWidth
                className={styles["environment-setup__input"]}
                placeholder="e.g., vpc-12345678"
              />

              <TextField
                name="metadata"
                label="Metadata (JSON)"
                value={formData.metadata}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                className={styles["environment-setup__input"]}
                placeholder='{"tags": {"environment": "production"}, "monitoring": true}'
                helperText="Optional JSON metadata for additional configuration"
              />

              {error && (
                <Alert severity="error" className={styles["environment-setup__error"]}>
                  {error}
                </Alert>
              )}

              <Box className={styles["environment-setup__actions"]}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formData.name.trim()}
                  endIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  className={styles["environment-setup__submit"]}
                >
                  {loading ? "Creating..." : "Create Environment & Complete Setup"}
                </Button>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnvironmentSetup;
