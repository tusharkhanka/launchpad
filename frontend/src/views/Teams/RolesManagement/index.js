import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress,
    IconButton,
    Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { listRoles, createRole, updateRole, deleteRole } from '../../../services/roles';
import AddRoleDialog from './components/AddRoleDialog';
import EditRoleDialog from './components/EditRoleDialog';
import styles from './style.module.scss';

const RolesManagement = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const history = useHistory();
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await listRoles();
            setRoles(response.data || []);
        } catch (err) {
            setError('Failed to fetch roles');
            console.error('Error fetching roles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = async (roleData) => {
        try {
            await createRole(roleData);
            setOpenAddDialog(false);
            fetchRoles(); // Refresh the list
        } catch (err) {
            console.error('Error creating role:', err);
            throw err; // Let the dialog handle the error
        }
    };

    const handleEditRole = async (roleData) => {
        try {
            await updateRole(selectedRole.id, roleData);
            setOpenEditDialog(false);
            setSelectedRole(null);
            fetchRoles(); // Refresh the list
        } catch (err) {
            console.error('Error updating role:', err);
            throw err; // Let the dialog handle the error
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
            try {
                await deleteRole(roleId);
                fetchRoles(); // Refresh the list
            } catch (err) {
                setError('Failed to delete role');
                console.error('Error deleting role:', err);
            }
        }
    };

    const handleEditClick = (role) => {
        setSelectedRole(role);
        setOpenEditDialog(true);
    };

    if (loading) {
        return (
            <Container className={styles.container}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => history.push('/teams')}
                        className={styles.backButton}
                    >
                        Back to Teams
                    </Button>
                    <Typography variant="h4" component="h1" className={styles.title}>
                        Roles Management
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className={styles.subtitle}>
                        Manage user roles and permissions
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    className={styles.createButton}
                >
                    Create Role
                </Button>
            </div>

            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    {error}
                </Alert>
            )}

            <div className={styles.rolesSection}>
                <Typography variant="h6" component="h2" className={styles.sectionTitle}>
                    Available Roles ({roles.length})
                </Typography>

                {roles.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Typography variant="h6" color="textSecondary">
                            No roles found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Create your first role to get started
                        </Typography>
                    </div>
                ) : (
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table className={styles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.tableHeader}>Role Name</TableCell>
                                    <TableCell className={styles.tableHeader}>Created</TableCell>
                                    <TableCell className={styles.tableHeader}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id} className={styles.tableRow}>
                                        <TableCell className={styles.tableCell}>
                                            <Typography variant="body1" className={styles.roleName}>
                                                {role.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className={styles.tableCell}>
                                            {new Date(role.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className={styles.tableCell}>
                                            <div className={styles.actions}>
                                                <Tooltip title="Edit role">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditClick(role)}
                                                        className={styles.editButton}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete role">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        className={styles.deleteButton}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            <AddRoleDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onCreateRole={handleCreateRole}
            />

            <EditRoleDialog
                open={openEditDialog}
                onClose={() => {
                    setOpenEditDialog(false);
                    setSelectedRole(null);
                }}
                onUpdateRole={handleEditRole}
                role={selectedRole}
            />
        </Container>
    );
};

export default RolesManagement;
