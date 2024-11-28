const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('organization', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    organizationname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    organizationdescription: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    creationdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    creatorid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'organization',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organization_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_organizationNameCreator",
        unique: true,
        fields: [
          { name: "organizationname" },
          { name: "creatorid" },
        ]
      },
    ]
  });
};
