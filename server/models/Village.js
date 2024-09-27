module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define("Village", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Village.associate = (models) => {
    Village.belongsTo(models.Parish, {
      foreignKey: "parishId",
      as: "parish",
    });
    Village.hasOne(models.VillageRegistra, {
      foreignKey: "villageId",
      as: "villageRegistra",
    });
  };

  return Village;
};
