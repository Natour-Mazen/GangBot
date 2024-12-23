const DataTypes = require("sequelize").DataTypes;
const _accessgroup = require("./accessgroup");
const _organization = require("./organization");
const _organizationprojects = require("./organizationprojects");
const _organizationusers = require("./organizationusers");
const _projects = require("./projects");
const _providermethods = require("./providermethods");
const _usergroups = require("./usergroups");
const _users = require("./users");
const _usertokens = require("./usertokens");

function initModels(sequelize) {
  const accessgroup = _accessgroup(sequelize, DataTypes);
  const organization = _organization(sequelize, DataTypes);
  const organizationprojects = _organizationprojects(sequelize, DataTypes);
  const organizationusers = _organizationusers(sequelize, DataTypes);
  const projects = _projects(sequelize, DataTypes);
  const providermethods = _providermethods(sequelize, DataTypes);
  const usergroups = _usergroups(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);
  const usertokens = _usertokens(sequelize, DataTypes);

  organization.belongsToMany(projects, { as: 'projectid_projects', through: organizationprojects, foreignKey: "organizationid", otherKey: "projectid" });
  organization.belongsToMany(users, { as: 'userid_users', through: organizationusers, foreignKey: "organizationid", otherKey: "userid" });
  projects.belongsToMany(organization, { as: 'organizationid_organizations', through: organizationprojects, foreignKey: "projectid", otherKey: "organizationid" });
  users.belongsToMany(organization, { as: 'organizationid_organization_organizationusers', through: organizationusers, foreignKey: "userid", otherKey: "organizationid" });
  users.belongsToMany(users, { as: 'userid_users_usergroups', through: usergroups, foreignKey: "groupid", otherKey: "userid" });
  users.belongsToMany(users, { as: 'groupid_users', through: usergroups, foreignKey: "userid", otherKey: "groupid" });
  users.belongsTo(providermethods, { as: "creationusermethod_providermethod", foreignKey: "creationusermethod"});
  organizationprojects.belongsTo(organization, { as: "organization", foreignKey: "organizationid"});
  organization.hasMany(organizationprojects, { as: "organizationprojects", foreignKey: "organizationid"});
  organizationusers.belongsTo(organization, { as: "organization", foreignKey: "organizationid"});
  organization.belongsTo(users, { as: "user", foreignKey: "creatorid"});
  users.hasMany(organization, { as: "organization", foreignKey: "creatorid"});
  organization.hasMany(organizationusers, { as: "organizationusers", foreignKey: "organizationid"});
  organizationprojects.belongsTo(projects, { as: "project", foreignKey: "projectid"});
  projects.hasMany(organizationprojects, { as: "organizationprojects", foreignKey: "projectid"});
  projects.belongsTo(providermethods, { as: "authenticationmethod_providermethod", foreignKey: "importmethodid"});
  providermethods.hasMany(projects, { as: "projects", foreignKey: "importmethodid"});
  usertokens.belongsTo(providermethods, { as: "authenticationmethod_providermethod", foreignKey: "authenticationmethod"});
  providermethods.hasMany(usertokens, { as: "usertokens", foreignKey: "authenticationmethod"});
  organizationusers.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(organizationusers, { as: "organizationusers", foreignKey: "userid"});
  projects.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(projects, { as: "projects", foreignKey: "userid"});
  usergroups.belongsTo(users, { as: "group", foreignKey: "groupid"});
  users.hasMany(usergroups, { as: "usergroups", foreignKey: "groupid"});
  usergroups.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(usergroups, { as: "user_usergroups", foreignKey: "userid"});
  usertokens.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(usertokens, { as: "usertokens", foreignKey: "userid"});

  return {
    accessgroup,
    organization,
    organizationprojects,
    organizationusers,
    projects,
    providermethods,
    usergroups,
    users,
    usertokens,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
