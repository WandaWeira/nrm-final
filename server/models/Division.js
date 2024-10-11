module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define("Division", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Division.associate = (models) => {
    Division.belongsTo(models.Municipality, {
      foreignKey: "municipalityId",
      as: "municipality",
    });
    Division.hasMany(models.Ward, {
      foreignKey: "divisionId",
      as: "wards",
    });
  };

  return Division;
};
