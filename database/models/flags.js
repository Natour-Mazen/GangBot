const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flags', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    projectid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      },
      unique: "unique_projectid_branch"
    },
    branch: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: "unique_projectid_branch"
    },
    content: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'flags',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "flags_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_projectid_branch",
        unique: true,
        fields: [
          { name: "projectid" },
          { name: "branch" },
        ]
      },
    ]
  });
};
