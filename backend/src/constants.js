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
  }
};

module.exports = { Constants };
