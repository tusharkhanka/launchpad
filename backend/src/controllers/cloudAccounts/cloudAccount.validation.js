const { body, param } = require('express-validator');

module.exports = {
  byId: () => [
    param('id').isUUID().withMessage('Invalid cloud account ID'),
  ],
  
  createCloudAccount: () => [
    body('provider')
      .isIn(['aws', 'gcp', 'azure', 'oracle'])
      .withMessage('Provider must be one of: aws, gcp, azure, oracle'),
    body('account_name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account name must be between 1 and 255 characters'),
    body('account_identifier')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account identifier must be between 1 and 255 characters'),
    body('access_keys')
      .isArray({ min: 1 })
      .withMessage('Access keys must be a non-empty array'),
    body('access_keys.*.key')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid key'),
    body('access_keys.*.value')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid value'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
  ],
  
  updateCloudAccount: () => [
    param('id').isUUID().withMessage('Invalid cloud account ID'),
    body('provider')
      .optional()
      .isIn(['aws', 'gcp', 'azure', 'oracle'])
      .withMessage('Provider must be one of: aws, gcp, azure, oracle'),
    body('account_name')
      .optional()
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account name must be between 1 and 255 characters'),
    body('account_identifier')
      .optional()
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account identifier must be between 1 and 255 characters'),
    body('access_keys')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Access keys must be a non-empty array'),
    body('access_keys.*.key')
      .optional()
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid key'),
    body('access_keys.*.value')
      .optional()
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid value'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
  ],
  
  listByOrganisation: () => [
    param('orgId').isUUID().withMessage('Invalid organisation ID'),
  ],
  
  createUnderOrg: () => [
    param('orgId').isUUID().withMessage('Invalid organisation ID'),
    body('provider')
      .isIn(['aws', 'gcp', 'azure', 'oracle'])
      .withMessage('Provider must be one of: aws, gcp, azure, oracle'),
    body('account_name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account name must be between 1 and 255 characters'),
    body('account_identifier')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Account identifier must be between 1 and 255 characters'),
    body('access_keys')
      .isArray({ min: 1 })
      .withMessage('Access keys must be a non-empty array'),
    body('access_keys.*.key')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid key'),
    body('access_keys.*.value')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid value'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
  ],

  testConnection: () => [
    body('provider')
      .isIn(['aws', 'gcp', 'azure', 'oracle'])
      .withMessage('Provider must be one of: aws, gcp, azure, oracle'),
    body('access_keys')
      .isArray({ min: 1 })
      .withMessage('Access keys must be a non-empty array'),
    body('access_keys.*.key')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid key'),
    body('access_keys.*.value')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each access key must have a valid value'),
  ],
};
