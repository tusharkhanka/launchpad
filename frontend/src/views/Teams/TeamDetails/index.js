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
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';

import { getTeam, getTeamMembers, addMemberToTeam, removeMemberFromTeam } from '../../../services/teams';
import AddMemberDialog from './components/AddMemberDialog';
import styles from './style.module.scss';

const TeamDetails = () => {
  const { teamId } = useParams();
  const history = useHistory();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [teamResponse, membersResponse] = await Promise.all([
        getTeam(teamId),
        getTeamMembers(teamId)
      ]);
      
      setTeam(teamResponse.data);
      setMembers(membersResponse.data || []);
    } catch (err) {
      setError('Failed to fetch team details');
      console.error('Error fetching team details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      await addMemberToTeam(teamId, memberData);
      setOpenAddDialog(false);
      fetchTeamDetails(); // Refresh the members list
    } catch (err) {
      console.error('Error adding member:', err);
      throw err; // Let the dialog handle the error
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from the team?')) {
      try {
        await removeMemberFromTeam(teamId, userId);
        fetchTeamDetails(); // Refresh the members list
      } catch (err) {
        setError('Failed to remove member');
        console.error('Error removing member:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
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

  if (!team) {
    return (
      <Container className={styles.container}>
        <Alert severity="error">Team not found</Alert>
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
            {team.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" className={styles.subtitle}>
            {team.email}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          className={styles.addMemberButton}
        >
          Add Member
        </Button>
      </div>

      {error && (
        <Alert severity="error" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <div className={styles.membersSection}>
        <Typography variant="h6" component="h2" className={styles.sectionTitle}>
          Team Members ({members.length})
        </Typography>

        {members.length === 0 ? (
          <div className={styles.emptyState}>
            <PersonIcon className={styles.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No members in this team
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add members to get started
            </Typography>
          </div>
        ) : (
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableHeader}>Name</TableCell>
                  <TableCell className={styles.tableHeader}>Email</TableCell>
                  <TableCell className={styles.tableHeader}>Role</TableCell>
                  <TableCell className={styles.tableHeader}>Status</TableCell>
                  <TableCell className={styles.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>
                      {member.username || 'N/A'}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {member.email}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Chip
                        label={member.role}
                        size="small"
                        color="secondary"
                        className={styles.roleChip}
                      />
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Chip
                        label={member.status}
                        size="small"
                        color={getStatusColor(member.status)}
                        className={styles.statusChip}
                      />
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Tooltip title="Remove member">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveMember(member.user_id)}
                          className={styles.deleteButton}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <AddMemberDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAddMember={handleAddMember}
      />
    </Container>
  );
};

export default TeamDetails;
