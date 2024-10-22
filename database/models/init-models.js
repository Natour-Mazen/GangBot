const DataTypes = require("sequelize").DataTypes;
const _flags = require("./flags");
const _projects = require("./projects");
const _users = require("./users");

function initModels(sequelize) {
  const flags = _flags(sequelize, DataTypes);
  const projects = _projects(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  flags.belongsTo(projects, { as: "project", foreignKey: "projectid"});
  projects.hasMany(flags, { as: "flags", foreignKey: "projectid"});
  projects.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(projects, { as: "projects", foreignKey: "userid"});

  return {
    flags,
    projects,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
