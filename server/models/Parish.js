module.exports = (sequelize, DataTypes) => {
  const Parish = sequelize.define("Parish", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Parish.associate = (models) => {
    Parish.belongsTo(models.Subcounty, {
      foreignKey: "subcountyId",
      as: "subcounty",
    });
    Parish.hasMany(models.Village, {
      foreignKey: "parishId",
      as: "villages",
    });
    Parish.hasMany(models.PollingStation, {
      foreignKey: "parishId",
      as: "pollingStations",
    });
    Parish.hasMany(models.Election, {
      foreignKey: "parishId",
      as: "elections",
    });
  };

  return Parish;
};
