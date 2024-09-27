module.exports = (sequelize, DataTypes) => {
  const CellRegistra = sequelize.define("CellRegistra", {
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

  CellRegistra.associate = (models) => {
    CellRegistra.belongsTo(models.Cell, {
      foreignKey: "cellId",
      as: "cell",
    });
  };

  return CellRegistra;
};
