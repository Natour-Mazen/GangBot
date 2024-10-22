var DataTypes = require("sequelize").DataTypes;
var _flags = require("./flags");
var _projects = require("./projects");
var _users = require("./users");

function initModels(sequelize) {
  var flags = _flags(sequelize, DataTypes);
  var projects = _projects(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

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
