const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    projectname: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    reponame: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    apikey: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    apikeyexpirationdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    flags: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'projects',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "projects_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
