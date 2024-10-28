const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accessgroup', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    groupname: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'accessgroup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "accessgroup_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
