const AppDataSource = require('../dataSource');

// Import models
const Organisation = require('./organisation');
const CloudAccount = require('./cloudAccount');
const Environment = require('./environment');
const Application = require('./application');
const Secret = require('./secret');
const Tag = require('./tag');
const ApplicationEnvironmentTagMapping = require('./applicationEnvironmentTagMapping');
const Test = require('./test');
const UserSessions = require('./userSessions');
const Team = require('./team');
const Role = require('./role');
const UserTeamRoleMapping = require('./userTeamRoleMapping');
const EntityVersion = require('./entityVersion');
const AuditTrail = require('./auditTrail');

// Set up associations
Organisation.associate({ Organisation, CloudAccount, Environment, Application });
CloudAccount.associate({ Organisation, CloudAccount, Environment });
Environment.associate({ Organisation, CloudAccount, Environment, ApplicationEnvironmentTagMapping });
Application.associate({ Organisation, ApplicationEnvironmentTagMapping });
Secret.associate({});
Tag.associate({ ApplicationEnvironmentTagMapping });
ApplicationEnvironmentTagMapping.associate({ Application, Tag, Environment });
Team.associate({ UserTeamRoleMapping });
Role.associate({ UserTeamRoleMapping });
UserTeamRoleMapping.associate({ Team, Role, Test });
AuditTrail.associate({ Test });

module.exports = {
  sequelize: AppDataSource,
  Organisation,
  CloudAccount,
  Environment,
  Application,
  Secret,
  Tag,
  ApplicationEnvironmentTagMapping,
  Test,
  UserSessions,
  Team,
  Role,
  UserTeamRoleMapping,
  EntityVersion,
  AuditTrail,
};
