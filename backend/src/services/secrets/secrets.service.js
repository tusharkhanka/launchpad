const AWSSecretsClient = require('./clients/AwsSecretsClient');
const entityVersionService = require('../entityVersions/entityVersion.service');
const { Constants } = require('../../constants');

class SecretsService {
  constructor() {
    this.clients = new Map();
  }

  getClient(provider, credentials = null) {
    const clientKey = `${provider}_${JSON.stringify(credentials || {})}`;
    
    if (!this.clients.has(clientKey)) {
      switch (provider.toLowerCase()) {
        case 'aws':
          this.clients.set(clientKey, new AWSSecretsClient(credentials));
          break;
        default:
          throw new Error(`Unsupported secrets provider: ${provider}`);
      }
    }
    return this.clients.get(clientKey);
  }

  async createSecret({ provider, name, secret, tags = {}, description, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.create({ name, secret, tags, description });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getSecret({ provider, secretId, versionId, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.get({ secretId, versionId });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getSecretVersion({ provider, secretId, versionId, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.getSecretVersion(secretId, versionId);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getSecretVersions({ provider, secretId, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.getVersions({ secretId });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateSecret({ provider, secretId, secret, description, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.update({ secretId, secret, description });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async listSecrets({ provider, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.list();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async revertSecretToVersion({ provider, secretId, currentVersion, revertToVersion, credentials }) {
    try {
      const client = this.getClient(provider, credentials);
      const result = await client.revertToVersion({ 
        secretId, 
        currentVersion, 
        revertToVersion 
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  // Helper method to validate secret data
  validateSecretData(secret) {
    if (!secret || typeof secret !== 'object') {
      throw new Error('Secret must be a valid object');
    }
    return true;
  }

  // Helper method to validate secret name
  validateSecretName(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Secret name must be a non-empty string');
    }
    
    // AWS Secrets Manager naming constraints
    if (name.length > 512) {
      throw new Error('Secret name must be less than 512 characters');
    }
    
    if (!/^[a-zA-Z0-9/_+=.@-]+$/.test(name)) {
      throw new Error('Secret name contains invalid characters');
    }
    
    return true;
  }

  // Helper method to validate tags
  validateTags(tags) {
    if (!tags || typeof tags !== 'object') {
      return true; // Tags are optional
    }
    
    const tagKeys = Object.keys(tags);
    if (tagKeys.length > 50) {
      throw new Error('Maximum 50 tags allowed');
    }
    
    for (const [key, value] of Object.entries(tags)) {
      if (key.length > 128) {
        throw new Error('Tag key must be less than 128 characters');
      }
      if (value.length > 256) {
        throw new Error('Tag value must be less than 256 characters');
      }
    }
    
    return true;
  }

  // Application-specific methods
  async initializeApplicationSecrets({ applicationName, environmentName, tagName, cloudAccountCredentials, provider = 'aws' }) {
    try {
      // Generate secret name: ${appname}_${envname}_${tag_name}
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      // Create base secret with NODE_ENV = environmentName
      const secretData = {
        NODE_ENV: environmentName
      };

      // Create tags for the secret
      const tags = {
        Application: applicationName,
        Environment: environmentName,
        Tag: tagName,
        Type: 'ApplicationSecret'
      };

      // Create the secret in the cloud provider
      const result = await this.createSecret({
        provider,
        name: secretName,
        secret: secretData,
        tags,
        description: `Application secret for ${applicationName} in ${environmentName} environment with ${tagName} tag`,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getApplicationSecret({ applicationName, environmentName, tagName, cloudAccountCredentials, provider = 'aws' }) {
    try {
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      const result = await this.getSecret({
        provider,
        secretId: secretName,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateApplicationSecret({ applicationName, environmentName, tagName, secretData, cloudAccountCredentials, provider = 'aws' }) {
    try {
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      const result = await this.updateSecret({
        provider,
        secretId: secretName,
        secret: secretData,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getApplicationSecretVersions({ applicationName, environmentName, tagName, cloudAccountCredentials, provider = 'aws' }) {
    try {
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      const result = await this.getSecretVersions({
        provider,
        secretId: secretName,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getApplicationSecretVersion({ applicationName, environmentName, tagName, versionId, cloudAccountCredentials, provider = 'aws' }) {
    try {
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      const result = await this.getSecretVersion({
        provider,
        secretId: secretName,
        versionId,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async revertApplicationSecret({ applicationName, environmentName, tagName, currentVersion, revertToVersion, cloudAccountCredentials, provider = 'aws' }) {
    try {
      const secretName = `${applicationName}_${environmentName}_${tagName}`;
      
      const result = await this.revertSecretToVersion({
        provider,
        secretId: secretName,
        currentVersion,
        revertToVersion,
        credentials: cloudAccountCredentials
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async createVersionRecord({ secretId, version, fromVersion, operation, metadata }) {
    try {
      return await entityVersionService.createVersionRecord({
        entity_type: Constants.VERSION_ENTITY_TYPES.SECRET,
        entity_id: secretId,
        version,
        from_version: fromVersion,
        operation,
        metadata
      });
    } catch (err) {
      throw err;
    }
  }

  async getVersionHistory({ secretId }) {
    try {
      return await entityVersionService.getEntityVersions({
        entity_type: Constants.VERSION_ENTITY_TYPES.SECRET,
        entity_id: secretId
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new SecretsService();
