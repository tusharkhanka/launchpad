import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Select,
  FormControl,
  Chip,
  Avatar,
} from "@material-ui/core";
import { AccountCircle, ExitToApp } from "@material-ui/icons";
import { getUserPayload, clearLocalStorage } from "config/helper";
import styles from "./style.module.scss";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [teamsList, setTeamsList] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Get user details from localStorage
    const userPayload = getUserPayload();
    console.log("User payload:", userPayload); // Debug log
    console.log("User image URL:", userPayload?.image); // Debug image URL
    
    if (userPayload) {
      // For testing - you can uncomment this line to test with a sample image
      // userPayload.image = "https://via.placeholder.com/150/1da1f2/ffffff?text=U";
      
      // Convert Google image URL to proxied URL to avoid CORS issues
      if (userPayload.image && userPayload.image.includes('googleusercontent.com')) {
        const encodedImageUrl = encodeURIComponent(userPayload.image);
        userPayload.image = `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/proxy-image?imageUrl=${encodedImageUrl}`;
      }
      
      setUserDetails(userPayload);
      setImageError(false); // Reset image error state
    } else {
      // Set default user details if no payload exists
      setUserDetails({
        name: "User",
        email: "user@example.com"
      });
    }
    
    // Mock teams data - replace with actual API call
    const mockTeams = [
      { id: 1, name: "Development Team", role: "Developer" },
      { id: 2, name: "Design Team", role: "Designer" },
      { id: 3, name: "Marketing Team", role: "Manager" },
    ];
    
    setTeamsList(mockTeams);
    
    // Set default team and role
    const defaultTeam = mockTeams[0];
    setSelectedTeam(defaultTeam);
    setUserRole(defaultTeam.role);
    
    // Store in localStorage
    localStorage.setItem("team", JSON.stringify(defaultTeam));
    localStorage.setItem("user_role", JSON.stringify(defaultTeam.role));
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearLocalStorage();
    window.location.href = "/login";
  };

  const handleTeamChange = (event) => {
    const teamName = event.target.value;
    const team = teamsList.find(t => t.name === teamName);
    if (team) {
      setSelectedTeam(team);
      setUserRole(team.role);
      localStorage.setItem("team", JSON.stringify(team));
      localStorage.setItem("user_role", JSON.stringify(team.role));
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div className={styles["profile__container"]}>
      <div className={styles["profile__team"]}>
        <Typography variant="body2" className={styles["profile__team-label"]}>
          Team:
        </Typography>
        {teamsList?.length > 0 && (
          <>
            <FormControl size="small" className={styles["profile__team-select"]}>
              <Select
                value={selectedTeam?.name || "Select a team"}
                onChange={handleTeamChange}
                displayEmpty
                className="profile_team"
              >
                {teamsList.map((team) => (
                  <MenuItem key={team.id} value={team.name}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {userRole && (
              <Chip
                label={userRole}
                className={styles["profile__role-tag"]}
                size="small"
              />
            )}
          </>
        )}
      </div>

      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
        className={styles["profile__avatar-button"]}
      >
        <Avatar 
          className={styles["profile__avatar"]}
          src={userDetails?.image}
          alt={userDetails?.name || "User"}
          onError={(e) => {
            console.log("Image failed to load due to CORS:", userDetails?.image);
            setImageError(true);
            // Hide the broken image and show fallback
            e.target.style.display = 'none';
          }}
          onLoad={() => {
            console.log("Image loaded successfully:", userDetails?.image);
          }}
        >
          {(imageError || !userDetails?.image) && (userDetails?.name?.charAt(0)?.toUpperCase() || <AccountCircle />)}
        </Avatar>
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileMenuClose}
        className={styles["profile__menu"]}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={styles["profile__user-info"]}>
          <Typography variant="subtitle1" className={styles["profile__user-name"]}>
            {userDetails?.name || "User Name"}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles["profile__user-email"]}>
            {userDetails?.email || "user@example.com"}
          </Typography>
        </div>
        <MenuItem onClick={handleLogout} className={styles["profile__menu-item"]}>
          <ExitToApp fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Profile;
