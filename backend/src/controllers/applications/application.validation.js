const { body, param, query } = require('express-validator');

const applicationValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Application name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Application name must be between 1 and 255 characters'),
    
    body('organisationId')
      .notEmpty()
      .withMessage('Organisation ID is required')
      .isUUID()
      .withMessage('Organisation ID must be a valid UUID'),
    
    body('environmentIds')
      .isArray({ min: 1 })
      .withMessage('At least one environment ID is required')
      .custom((value) => {
        if (!value.every(id => typeof id === 'string' && id.length > 0)) {
          throw new Error('All environment IDs must be valid UUIDs');
        }
        return true;
      }),
    
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
  ],

  getById: [
    param('id')
      .isUUID()
      .withMessage('Application ID must be a valid UUID')
  ],

  getSecrets: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required')
  ],

  getTags: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required')
  ],

  updateSecrets: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required'),
    
    body('secrets')
      .isArray()
      .withMessage('Secrets must be an array')
      .custom((value) => {
        if (!value.every(secret => 
          secret.tag_name && 
          secret.secret_data && 
          secret.secret_data.secret
        )) {
          throw new Error('Each secret must have tag_name and secret_data.secret');
        }
        return true;
      })
  ],

  createTag: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required'),
    
    body('name')
      .notEmpty()
      .withMessage('Tag name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Tag name must be between 1 and 255 characters')
  ],

  deleteSecret: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required'),
    
    body('secretKey')
      .notEmpty()
      .withMessage('Secret key is required')
  ],

  list: [
    query('organisationId')
      .optional()
      .isUUID()
      .withMessage('Organisation ID must be a valid UUID')
  ],

  getSecretVersions: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required'),
    
    param('tagName')
      .notEmpty()
      .withMessage('Tag name is required')
  ],

  revertSecret: [
    param('applicationName')
      .notEmpty()
      .withMessage('Application name is required'),
    
    param('environmentName')
      .notEmpty()
      .withMessage('Environment name is required'),
    
    body('tag_name')
      .notEmpty()
      .withMessage('Tag name is required'),
    
    body('current_version_id')
      .notEmpty()
      .withMessage('Current version ID is required'),
    
    body('revert_to_version_id')
      .notEmpty()
      .withMessage('Revert to version ID is required')
  ]
};

module.exports = applicationValidation;
