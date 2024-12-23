const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    importmethodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'importmethodid',
        key: 'id'
      }
    },
    projectname: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: "unique_repo_branch"
    },
    environment: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "unique_repo_branch"
    },
    apikey: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "projects_apikey_key"
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
        name: "projects_apikey_key",
        unique: true,
        fields: [
          { name: "apikey" },
        ]
      },
      {
        name: "projects_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_repo_branch",
        unique: true,
        fields: [
          { name: "name" },
          { name: "environment" },
        ]
      },
    ]
  });
};
