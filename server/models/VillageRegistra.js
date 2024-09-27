module.exports = (sequelize, DataTypes) => {
  const VillageRegistra = sequelize.define("VillageRegistra", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ninNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  VillageRegistra.associate = (models) => {
    VillageRegistra.belongsTo(models.Village, {
      foreignKey: "villageId",
      as: "village",
    });
  };

  return VillageRegistra;
};
