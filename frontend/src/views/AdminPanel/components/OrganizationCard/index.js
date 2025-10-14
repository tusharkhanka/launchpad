import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Business, ExpandMore, ExpandLess, MoreVert, Edit, Delete, Add } from "@material-ui/icons";

import CloudAccountCard from "../CloudAccountCard";
import styles from "./style.module.scss";

const OrganizationCard = ({ organization, isExpanded, onExpand, onEdit, onDelete, onAddCloudAccount, onEditCloudAccount, onDeleteCloudAccount, onAddEnvironment, onEditEnvironment, onDeleteEnvironment }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Handle case where organization might be undefined
  if (!organization) {
    return null;
  }

  const { id, name, cloudAccounts = [], environments = [] } = organization;
  
  // Ensure environments is always an array
  const safeEnvironments = Array.isArray(environments) ? environments : [];
  const safeCloudAccounts = Array.isArray(cloudAccounts) ? cloudAccounts : [];

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(organization);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(organization);
  };

  const handleAddCloudAccount = () => {
    handleMenuClose();
    onAddCloudAccount(organization);
  };

  return (
    <Card className={styles["organization-card"]}>
      <CardContent>
        {/* Organization Header */}
        <Box className={styles["organization-card__header"]}>
          <Box className={styles["organization-card__info"]}>
            <Business className={styles["organization-card__icon"]} />
            <Box className={styles["organization-card__details"]}>
              <Typography variant="h6" className={styles["organization-card__name"]}>
                {name}
              </Typography>
              <Typography variant="body2" className={styles["organization-card__id"]}>
                ID: {id}
              </Typography>
            </Box>
          </Box>
          
          <Box className={styles["organization-card__stats"]}>
            <Typography variant="body2" className={styles["organization-card__stat"]}>
              {safeCloudAccounts.length} Cloud Account{safeCloudAccounts.length !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2" className={styles["organization-card__stat"]}>
              {safeEnvironments.length} Environment{safeEnvironments.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Box className={styles["organization-card__actions"]}>
            <IconButton
              onClick={handleMenuOpen}
              className={styles["organization-card__menu"]}
              aria-label="organization actions"
            >
              <MoreVert />
            </IconButton>
            <IconButton
              onClick={onExpand}
              className={styles["organization-card__expand"]}
              aria-label="expand organization"
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Expandable Content */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box className={styles["organization-card__content"]}>
            {safeCloudAccounts.length === 0 && safeEnvironments.length === 0 ? (
              <Box className={styles["organization-card__empty"]}>
                <Typography variant="body2" color="textSecondary" className={styles["organization-card__empty-text"]}>
                  No resources yet
                </Typography>
                <Typography variant="caption" color="textSecondary" className={styles["organization-card__empty-subtitle"]}>
                  Add cloud accounts and environments to get started
                </Typography>
              </Box>
            ) : (
              <Box className={styles["organization-card__resources"]}>
                {safeCloudAccounts?.map((cloudAccount) => (
                  <CloudAccountCard
                    key={cloudAccount.id}
                    cloudAccount={cloudAccount}
                    environments={safeEnvironments.filter(env => 
                      env.cloud_account_id === cloudAccount.id
                    )}
                    onEdit={onEditCloudAccount}
                    onDelete={onDeleteCloudAccount}
                    onAddEnvironment={onAddEnvironment}
                    onEditEnvironment={onEditEnvironment}
                    onDeleteEnvironment={onDeleteEnvironment}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" style={{ marginRight: 8 }} />
          Edit Organization
        </MenuItem>
        <MenuItem onClick={handleAddCloudAccount}>
          <Add fontSize="small" style={{ marginRight: 8 }} />
          Add Cloud Account
        </MenuItem>
        <MenuItem onClick={handleDelete} style={{ color: '#ef4444' }}>
          <Delete fontSize="small" style={{ marginRight: 8 }} />
          Delete Organization
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default OrganizationCard;
