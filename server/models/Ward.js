module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define("Ward", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Ward.associate = (models) => {
    Ward.belongsTo(models.Division, {
      foreignKey: "divisionId",
      as: "division",
    });
    Ward.hasMany(models.Cell, {
      foreignKey: "wardId",
      as: "cells",
    });
  };

  return Ward;
};
