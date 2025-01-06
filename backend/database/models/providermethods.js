const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('providermethods', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    providername: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'providermethods',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "providermethods_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
