const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authuserstokens', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: 'authuserstokens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "authuserstokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
