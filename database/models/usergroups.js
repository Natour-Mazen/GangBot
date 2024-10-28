const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usergroups', {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    groupid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'accessgroup',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'usergroups',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usergroups_pkey",
        unique: true,
        fields: [
          { name: "userid" },
          { name: "groupid" },
        ]
      },
    ]
  });
};
