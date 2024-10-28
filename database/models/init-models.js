const DataTypes = require("sequelize").DataTypes;
const _accessgroup = require("./accessgroup");
const _projects = require("./projects");
const _usergroups = require("./usergroups");
const _users = require("./users");

function initModels(sequelize) {
  const accessgroup = _accessgroup(sequelize, DataTypes);
  const projects = _projects(sequelize, DataTypes);
  const usergroups = _usergroups(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  accessgroup.belongsToMany(users, { as: 'userid_users', through: usergroups, foreignKey: "groupid", otherKey: "userid" });
  users.belongsToMany(accessgroup, { as: 'groupid_accessgroups', through: usergroups, foreignKey: "userid", otherKey: "groupid" });
  usergroups.belongsTo(accessgroup, { as: "group", foreignKey: "groupid"});
  accessgroup.hasMany(usergroups, { as: "usergroups", foreignKey: "groupid"});
  projects.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(projects, { as: "projects", foreignKey: "userid"});
  usergroups.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(usergroups, { as: "usergroups", foreignKey: "userid"});

  return {
    accessgroup,
    projects,
    usergroups,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
