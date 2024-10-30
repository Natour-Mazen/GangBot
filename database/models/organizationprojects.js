const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('organizationprojects', {
    organizationid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    projectid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'organizationprojects',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organizationprojects_pkey",
        unique: true,
        fields: [
          { name: "organizationid" },
          { name: "projectid" },
        ]
      },
    ]
  });
};
