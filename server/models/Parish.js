module.exports = (sequelize, DataTypes) => {
  const Parish = sequelize.define("Parish", {
    name: {
      type: DataTypes.STRING,
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
    Parish.hasOne(models.ParishRegistra, {
      foreignKey: "parishId",
      as: "parishRegistra",
    });
  };

  return Parish;
};
