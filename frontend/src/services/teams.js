import { httpClient, TEAMS_URL, TEAM_BY_ID_URL, TEAM_MEMBERS_URL, TEAM_MEMBER_BY_ID_URL } from "../config/api";

export const createTeam = async (data) => {
  return httpClient.post({ 
    url: TEAMS_URL, 
    data: {
      name: data.name,
      email: data.email
    },
    token: true
  });
};

export const getTeam = async (id) => {
  return httpClient.get({ url: TEAM_BY_ID_URL(id), token: true });
};

export const updateTeam = async (id, data) => {
  return httpClient.put({ url: TEAM_BY_ID_URL(id), data, token: true });
};

export const deleteTeam = async (id) => {
  return httpClient.delete({ url: TEAM_BY_ID_URL(id), token: true });
};

export const listTeams = async () => {
  return httpClient.get({ url: TEAMS_URL, token: true });
};

// Team Members
export const getTeamMembers = async (teamId) => {
  return httpClient.get({ url: TEAM_MEMBERS_URL(teamId), token: true });
};

export const addMemberToTeam = async (teamId, data) => {
  return httpClient.post({ 
    url: TEAM_MEMBERS_URL(teamId), 
    data: {
      userId: data.userId,
      roleId: data.roleId
    },
    token: true
  });
};

export const removeMemberFromTeam = async (teamId, userId) => {
  return httpClient.delete({ url: TEAM_MEMBER_BY_ID_URL(teamId, userId), token: true });
};