module.exports = (sequelize, DataTypes) => {
  const Cell = sequelize.define("Cell", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Cell.associate = (models) => {
    Cell.belongsTo(models.Ward, {
      foreignKey: 'wardId',
      as: 'ward'
    });
  };

  return Cell;
};
