const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('providersauthuserstokens', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: Sequelize.UUIDV4
    },
    providermethod: {
      type: DataTypes.UUIDV4,
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
    tableName: 'providersauthuserstokens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "providersauthuserstokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_providerMethod_jwtToken",
        unique: true,
        fields: [
          { name: "providermethod" },
          { name: "jwttoken" },
        ]
      },
    ]
  });
};
