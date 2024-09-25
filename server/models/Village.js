module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define("Village", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Village.associate = (models) => {
    Village.belongsTo(models.Parish, {
      foreignKey: "parishId",
      as: "parish",
    });
  };

  return Village;
};
