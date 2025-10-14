import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { getUserTeamsAndRoles } from '../../services/users';
import styles from './style.module.scss';

const TeamsDropdown = () => {
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetchUserTeams();
  }, []);

  const fetchUserTeams = async () => {
    try {
      setLoading(true);
      const response = await getUserTeamsAndRoles();
      setUserTeams(response.data || []);
      
      // Set first team as default if available
      if (response.data && response.data.length > 0) {
        setSelectedTeam(response.data[0].team_id);
      }
    } catch (error) {
      console.error('Error fetching user teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" className={styles.dropdownContainer}>
        <CircularProgress size={20} />
        <Typography variant="body2" className={styles.loadingText}>
          Loading teams...
        </Typography>
      </Box>
    );
  }

  if (userTeams.length === 0) {
    return (
      <Box className={styles.dropdownContainer}>
        <Typography variant="body2" color="textSecondary">
          No teams found
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.teamContainer}>
      <Typography variant="body1" className={styles.teamLabel}>
       <b> Team: </b>
      </Typography>
      <FormControl className={styles.dropdownContainer}>
        <Select
          value={selectedTeam}
          onChange={handleTeamChange}
          className={styles.select}
          displayEmpty
          renderValue={(value) => {
            const selectedTeamData = userTeams.find(team => team.team_id === value);
            if (selectedTeamData) {
              return (
                <Box className={styles.selectedTeamDisplay}>
                  <Typography variant="body2" className={styles.selectedTeamName}>
                    {selectedTeamData.team_name}
                  </Typography>
                  <span className={styles.selectedRoleTag}>
                    {selectedTeamData.role_name}
                  </span>
                </Box>
              );
            }
            return <Typography variant="body2">Select Team</Typography>;
          }}
        >
          {userTeams.map((team) => (
            <MenuItem key={team.team_id} value={team.team_id} className={styles.menuItem}>
              <Box className={styles.teamItem}>
                <Typography variant="body1" className={styles.teamName}>
                  {team.team_name}
                </Typography>
                <span className={styles.roleTag}>
                  {team.role_name}
                </span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TeamsDropdown;
