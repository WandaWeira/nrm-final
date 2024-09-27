module.exports = (sequelize, DataTypes) => {
  const WardRegistra = sequelize.define("WardRegistra", {
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

  WardRegistra.associate = (models) => {
    WardRegistra.belongsTo(models.Ward, {
      foreignKey: "wardId",
      as: "ward",
    });
  };

  return WardRegistra;
};
