const DataTypes = require("sequelize").DataTypes;
const _projects = require("./projects");
const _users = require("./users");

function initModels(sequelize) {
  const projects = _projects(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  projects.belongsTo(users, { as: "user", foreignKey: "userid"});
  users.hasMany(projects, { as: "projects", foreignKey: "userid"});

  return {
    projects,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
