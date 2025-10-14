import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';

import { listTeams, createTeam } from '../../services/teams';
import AddTeamDialog from './components/AddTeamDialog';
import styles from './style.module.scss';

const Teams = () => {
  const history = useHistory();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listTeams();
      setTeams(response.data || []);
    } catch (err) {
      setError('Failed to fetch teams');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      await createTeam(teamData);
      setOpenAddDialog(false);
      fetchTeams(); // Refresh the list
    } catch (err) {
      console.error('Error creating team:', err);
      throw err; // Let the dialog handle the error
    }
  };

  const handleTeamClick = (teamId) => {
    history.push(`/teams/${teamId}`);
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
          <Typography variant="h4" component="h1" className={styles.title}>
            Teams
          </Typography>
          <Typography variant="body1" color="textSecondary" className={styles.subtitle}>
            Manage your teams and members
          </Typography>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => history.push('/teams/roles')}
            className={styles.rolesButton}
          >
            Manage Roles
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            className={styles.createButton}
          >
            Create Team
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <div className={styles.teamsGrid}>
        {teams.length === 0 ? (
          <div className={styles.emptyState}>
            <GroupIcon className={styles.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No teams found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your first team to get started
            </Typography>
          </div>
        ) : (
          teams.map((team) => (
            <Card
              key={team.id}
              className={styles.teamCard}
              onClick={() => handleTeamClick(team.id)}
            >
              <CardContent>
                <div className={styles.teamHeader}>
                  <Typography variant="h6" component="h2" className={styles.teamName}>
                    {team.name}
                  </Typography>
                </div>
                <Typography variant="body2" color="textSecondary" className={styles.teamEmail}>
                  {team.email}
                </Typography>
                <Typography variant="caption" color="textSecondary" className={styles.teamDate}>
                  Created: {new Date(team.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddTeamDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onCreateTeam={handleCreateTeam}
      />
    </Container>
  );
};

export default Teams;