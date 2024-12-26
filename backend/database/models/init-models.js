const DataTypes = require("sequelize").DataTypes;
const _accessgroup = require("./accessgroup");
const _organization = require("./organization");
const _organizationprojects = require("./organizationprojects");
const _organizationusers = require("./organizationusers");
const _projects = require("./projects");
const _providermethods = require("./providermethods");
const _usergroups = require("./usergroups");
const _users = require("./users");
const _authuserstokens = require("./authUsersTokens");
const _providersauthuserstokens = require("./providersAuthUsersTokens");

function defineAssociations(models) {
  const {
    organization,
    projects,
    users,
    providermethods,
    organizationprojects,
    organizationusers,
    usergroups,
    authuserstokens,
    providersauthuserstokens,
  } = models;

  const belongsToManyMappings = [
    { source: organization, target: projects, through: organizationprojects, foreignKey: "organizationid", otherKey: "projectid", alias: "projectid_projects" },
    { source: organization, target: users, through: organizationusers, foreignKey: "organizationid", otherKey: "userid", alias: "userid_users" },
    { source: projects, target: organization, through: organizationprojects, foreignKey: "projectid", otherKey: "organizationid", alias: "organizationid_organizations" },
    { source: users, target: organization, through: organizationusers, foreignKey: "userid", otherKey: "organizationid", alias: "organizationid_organization_organizationusers" },
    { source: users, target: users, through: usergroups, foreignKey: "groupid", otherKey: "userid", alias: "userid_users_usergroups" },
    { source: users, target: users, through: usergroups, foreignKey: "userid", otherKey: "groupid", alias: "groupid_users" },
  ];

  const belongsToMappings = [
    { source: users, target: providermethods, foreignKey: "creationusermethod", alias: "creationusermethod_providermethod" },
    { source: organizationprojects, target: organization, foreignKey: "organizationid", alias: "organization" },
    { source: organizationprojects, target: projects, foreignKey: "projectid", alias: "project" },
    { source: projects, target: providermethods, foreignKey: "importmethodid", alias: "authenticationmethod_providermethod" },
    { source: authuserstokens, target: providermethods, foreignKey: "authenticationmethod", alias: "authenticationmethod_providermethod" },
    { source: providersauthuserstokens, target: providermethods, foreignKey: "providermethod", alias: "providerauthenticationmethod_providermethod" },
    { source: organizationusers, target: users, foreignKey: "userid", alias: "user" },
    { source: projects, target: users, foreignKey: "userid", alias: "user" },
    { source: usergroups, target: users, foreignKey: "groupid", alias: "group" },
    { source: usergroups, target: users, foreignKey: "userid", alias: "user" },
    { source: authuserstokens, target: users, foreignKey: "userid", alias: "user" },
  ];

  const hasManyMappings = [
    { source: organization, target: organizationprojects, foreignKey: "organizationid", alias: "organizationprojects" },
    { source: organization, target: organizationusers, foreignKey: "organizationid", alias: "organizationusers" },
    { source: projects, target: organizationprojects, foreignKey: "projectid", alias: "organizationprojects" },
    { source: providermethods, target: projects, foreignKey: "importmethodid", alias: "projects" },
    { source: providermethods, target: authuserstokens, foreignKey: "authenticationmethod", alias: "authuserstokens" },
    { source: providermethods, target: providersauthuserstokens, foreignKey: "providermethod", alias: "providersauthuserstokens" },
    { source: users, target: organization, foreignKey: "creatorid", alias: "organization" },
    { source: users, target: organizationusers, foreignKey: "userid", alias: "organizationusers" },
    { source: users, target: projects, foreignKey: "userid", alias: "projects" },
    { source: users, target: usergroups, foreignKey: "groupid", alias: "usergroups" },
    { source: users, target: usergroups, foreignKey: "userid", alias: "user_usergroups" },
    { source: users, target: authuserstokens, foreignKey: "userid", alias: "authuserstokens" },
  ];

  belongsToManyMappings.forEach(({ source, target, through, foreignKey, otherKey, alias }) => {
    source.belongsToMany(target, { as: alias, through, foreignKey, otherKey });
  });

  belongsToMappings.forEach(({ source, target, foreignKey, alias }) => {
    source.belongsTo(target, { as: alias, foreignKey });
  });

  hasManyMappings.forEach(({ source, target, foreignKey, alias }) => {
    source.hasMany(target, { as: alias, foreignKey });
  });
}

function initModels(sequelize) {
  const models = {
    accessgroup: _accessgroup(sequelize, DataTypes),
    organization: _organization(sequelize, DataTypes),
    organizationprojects: _organizationprojects(sequelize, DataTypes),
    organizationusers: _organizationusers(sequelize, DataTypes),
    projects: _projects(sequelize, DataTypes),
    providermethods: _providermethods(sequelize, DataTypes),
    usergroups: _usergroups(sequelize, DataTypes),
    users: _users(sequelize, DataTypes),
    authuserstokens: _authuserstokens(sequelize, DataTypes),
    providersauthuserstokens: _providersauthuserstokens(sequelize, DataTypes),
  };

  defineAssociations(models);

  return models;
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
