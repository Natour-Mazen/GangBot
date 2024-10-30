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
    ]
  });
};
