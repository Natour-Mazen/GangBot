const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usertokens', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    authenticationmethod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'providermethods',
        key: 'id'
      }
    },
    jwttoken: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usertokens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usertokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
