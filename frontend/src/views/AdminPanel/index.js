import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Search, Refresh } from "@material-ui/icons";

import { listOrganizations } from "services/organizations";
import { listCloudAccounts } from "services/cloudAccounts";
import { listEnvironments } from "services/environments";
import OrganizationCard from "./components/OrganizationCard";
import OrganizationDialog from "./components/OrganizationDialog";
import CloudAccountDialog from "./components/CloudAccountDialog";
import EnvironmentDialog from "./components/EnvironmentDialog";
import styles from "./style.module.scss";

const AdminPanel = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrg, setExpandedOrg] = useState(null);
  
  // Dialog states
  const [orgDialog, setOrgDialog] = useState({ open: false, mode: "create", organization: null });
  const [cloudAccountDialog, setCloudAccountDialog] = useState({ open: false, mode: "create", cloudAccount: null, organization: null });
  const [environmentDialog, setEnvironmentDialog] = useState({ open: false, mode: "create", environment: null, organization: null, cloudAccount: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch organizations
      const orgResponse = await listOrganizations();
      const orgs = orgResponse?.data || [];
      
      // For each organization, fetch cloud accounts and environments
      const orgsWithData = await Promise.all(
        orgs.map(async (org) => {
          try {
            const [cloudAccountsResponse, environmentsResponse] = await Promise.all([
              listCloudAccounts(org.id).catch(err => {
                console.warn(`Failed to fetch cloud accounts for org ${org.id}:`, err);
                return { data: [] };
              }),
              listEnvironments(org.id).catch(err => {
                console.warn(`Failed to fetch environments for org ${org.id}:`, err);
                return { data: [] };
              })
            ]);

            return {
              ...org,
              cloudAccounts: cloudAccountsResponse?.data || [],
              environments: environmentsResponse?.data || []
            };
          } catch (err) {
            console.error(`Error fetching data for org ${org.id}:`, err);
            return {
              ...org,
              cloudAccounts: [],
              environments: []
            };
          }
        })
      );

      setOrganizations(orgsWithData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrgExpand = (orgId) => {
    setExpandedOrg(expandedOrg === orgId ? null : orgId);
  };

  // Organization handlers
  const handleCreateOrganization = () => {
    setOrgDialog({ open: true, mode: "create", organization: null });
  };

  const handleEditOrganization = (organization) => {
    setOrgDialog({ open: true, mode: "edit", organization });
  };

  const handleDeleteOrganization = (organization) => {
    setOrgDialog({ open: true, mode: "delete", organization });
  };

  const handleAddCloudAccount = (organization) => {
    setCloudAccountDialog({ open: true, mode: "create", cloudAccount: null, organization });
  };

  // Cloud Account handlers
  const handleEditCloudAccount = (cloudAccount) => {
    const organization = organizations.find(org => 
      org.cloudAccounts.some(ca => ca.id === cloudAccount.id)
    );
    setCloudAccountDialog({ open: true, mode: "edit", cloudAccount, organization });
  };

  const handleDeleteCloudAccount = (cloudAccount) => {
    const organization = organizations.find(org => 
      org.cloudAccounts.some(ca => ca.id === cloudAccount.id)
    );
    setCloudAccountDialog({ open: true, mode: "delete", cloudAccount, organization });
  };

  const handleAddEnvironment = (cloudAccount) => {
    const organization = organizations.find(org => 
      org.cloudAccounts.some(ca => ca.id === cloudAccount.id)
    );
    setEnvironmentDialog({ open: true, mode: "create", environment: null, organization, cloudAccount });
  };

  // Environment handlers
  const handleEditEnvironment = (environment) => {
    const organization = organizations.find(org => 
      org.environments.some(env => env.id === environment.id)
    );
    const cloudAccount = organization?.cloudAccounts.find(ca => 
      ca.id === environment.cloud_account_id
    );
    setEnvironmentDialog({ open: true, mode: "edit", environment, organization, cloudAccount });
  };

  const handleDeleteEnvironment = (environment) => {
    const organization = organizations.find(org => 
      org.environments.some(env => env.id === environment.id)
    );
    const cloudAccount = organization?.cloudAccounts.find(ca => 
      ca.id === environment.cloud_account_id
    );
    setEnvironmentDialog({ open: true, mode: "delete", environment, organization, cloudAccount });
  };

  // Dialog close handlers
  const handleOrgDialogClose = () => {
    setOrgDialog({ open: false, mode: "create", organization: null });
  };

  const handleCloudAccountDialogClose = () => {
    setCloudAccountDialog({ open: false, mode: "create", cloudAccount: null, organization: null });
  };

  const handleEnvironmentDialogClose = () => {
    setEnvironmentDialog({ open: false, mode: "create", environment: null, organization: null, cloudAccount: null });
  };

  // Success handlers
  const handleDialogSuccess = () => {
    fetchData(); // Refresh data after any CRUD operation
  };

  if (loading) {
    return (
      <div className={styles["admin-panel"]}>
        <div className={styles["admin-panel__loading"]}>
          <CircularProgress size={48} />
          <Typography variant="body1" className={styles["admin-panel__loading-text"]}>
            Loading organizations...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["admin-panel"]}>
      {/* Header */}
      <div className={styles["admin-panel__header"]}>
        <div className={styles["admin-panel__title-section"]}>
          <Typography variant="h4" className={styles["admin-panel__title"]}>
            Admin Panel
          </Typography>
          <Typography variant="body1" className={styles["admin-panel__subtitle"]}>
            Manage your organizations, cloud accounts, and environments
          </Typography>
        </div>

        {/* Search and Actions */}
        <div className={styles["admin-panel__actions"]}>
          <TextField
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            className={styles["admin-panel__search"]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrganization}
            className={styles["admin-panel__add-org"]}
          >
            Add Organization
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
            className={styles["admin-panel__refresh"]}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          className={styles["admin-panel__error"]}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Content */}
      <div className={styles["admin-panel__content"]}>
        {filteredOrganizations.length === 0 ? (
          <div className={styles["admin-panel__empty"]}>
            <Typography variant="h6" className={styles["admin-panel__empty-title"]}>
              {searchTerm ? "No organizations found" : "No organizations yet"}
            </Typography>
            <Typography variant="body2" className={styles["admin-panel__empty-subtitle"]}>
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first organization to get started"
              }
            </Typography>
          </div>
        ) : (
          <div className={styles["admin-panel__organizations"]}>
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                isExpanded={expandedOrg === org.id}
                onExpand={() => handleOrgExpand(org.id)}
                onEdit={handleEditOrganization}
                onDelete={handleDeleteOrganization}
                onAddCloudAccount={handleAddCloudAccount}
                onEditCloudAccount={handleEditCloudAccount}
                onDeleteCloudAccount={handleDeleteCloudAccount}
                onAddEnvironment={handleAddEnvironment}
                onEditEnvironment={handleEditEnvironment}
                onDeleteEnvironment={handleDeleteEnvironment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <OrganizationDialog
        open={orgDialog.open}
        onClose={handleOrgDialogClose}
        organization={orgDialog.organization}
        mode={orgDialog.mode}
        onSuccess={handleDialogSuccess}
      />

      <CloudAccountDialog
        open={cloudAccountDialog.open}
        onClose={handleCloudAccountDialogClose}
        cloudAccount={cloudAccountDialog.cloudAccount}
        organization={cloudAccountDialog.organization}
        mode={cloudAccountDialog.mode}
        onSuccess={handleDialogSuccess}
      />

      <EnvironmentDialog
        open={environmentDialog.open}
        onClose={handleEnvironmentDialogClose}
        environment={environmentDialog.environment}
        organization={environmentDialog.organization}
        cloudAccount={environmentDialog.cloudAccount}
        mode={environmentDialog.mode}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};

export default AdminPanel;
