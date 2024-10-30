const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('organizationusers', {
    organizationid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'organizationusers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organizationusers_pkey",
        unique: true,
        fields: [
          { name: "organizationid" },
          { name: "userid" },
        ]
      },
    ]
  });
};
