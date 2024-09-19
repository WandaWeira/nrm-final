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
    Ward.belongsTo(models.Municipality, {
      foreignKey: "municipalityId",
      as: "municipality",
    });
    Ward.hasMany(models.Cell, {
      foreignKey: "wardId",
      as: "cells",
    });
    Ward.hasMany(models.Election, {
      foreignKey: "wardId",
      as: "elections",
    });
  };

  return Ward;
};
