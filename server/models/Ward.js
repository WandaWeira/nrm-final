module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define("Ward", {
    name: {
      type: DataTypes.STRING,
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
    Ward.hasOne(models.WardRegistra, {
      foreignKey: "wardId",
      as: "wardRegistra",
    });
  };

  return Ward;
};
