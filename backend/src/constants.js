const Constants = {
  RESPONSES: {
    ERROR_TEXTS: {
      STATUS_CODE_MISSING: 'Status code is missing',
      STATUS_CODE_NUMBER: 'Status code passed is not a number',
      DATA_MISSING: 'Data is missing',
      MESSAGE_MISSING: 'Error message is missing',
      ERROR_500_MESSAGE: 'Unhandled Exception!!',
      FAILED_TO_UPDATE_MESSAGE: 'Failed to update the message',
      SUPER_ADMIN_ACCESS_DENIED: 'You dont have access to this module'
    },

    SUCCESS_TEXTS: {
      SUCCESS: 'Success',
      SUCCESS_MESSAGE: 'Successfully sent',
      PROCESS_MESSAGE: 'Processing a message',
      SUCCESS_ON_UPDATE_MESSAGE: 'Successfully updated the message',
    },
  },

  TIMEOUTS: {
    JOB_SLEEP_MS: 5000,
    JOB_TIMEOUT_MS: 60000
  },

  VERSION_ENTITY_TYPES: {
    SECRET: 'SECRET',
    APPLICATION: 'APPLICATION'
  },

  VERSION_ENTITY_OPERATIONS: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    REVERT: 'REVERT'
  },

  AUDIT_ENTITY_MAP: {
    applications: "APPLICATION",
    arsenals: "ARSENAL",
    auth: "AUTH",
    cost: "COST",
    iam: "AWS",
    lipi: "SCALING",
    mistri: "MISTRI",
    requests: "REQUESTS",
    serveraccess: "SERVER ACCESS",
    user: "USER",
    organisations: "ORGANISATION",
    'cloud-accounts': "CLOUD ACCOUNT",
    environments: "ENVIRONMENT",
    teams: "TEAM",
    roles: "ROLE",
  },

  AUDIT_ACTION_MAP: {
    POST: "CREATE",
    PUT: "UPDATE",
    DELETE: "DELETE",
    PATCH: "UPDATE",
    REVERT: "REVERT",
  },

  AUDIT_SUB_ENTITIES: {
    arsenals: "DATA",
    environment: "ENVIRONMENT",
    secrets: "SECRET",
    secret: "SECRET",
    configs: "CONFIG",
    tag: "TAG",
    groups: "IAM GROUP",
    requests: "REQUEST",
    request: "REQUEST",
    sshkey: "SSH KEY",
    sso: "SSO",
    signup: "SIGNUP",
    login: "LOGIN",
    logout: "LOGOUT",
    user: "USER",
    hpa: "HPA",
    k8deployment: "K8 DEPLOYMENT FREEZE",
    asg: "EC2|ASG",
    gateway: "GATEWAY",
  }
};

module.exports = { Constants };
