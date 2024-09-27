module.exports = (sequelize, DataTypes) => {
  const Cell = sequelize.define("Cell", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Cell.associate = (models) => {
    Cell.belongsTo(models.Ward, {
      foreignKey: 'wardId',
      as: 'ward'
    });
    Cell.hasOne(models.CellRegistra, {
      foreignKey: "cellId",
      as: "cellRegistra",
    });
  };

  return Cell;
};
