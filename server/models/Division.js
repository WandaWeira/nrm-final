module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define("Division", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Division.associate = (models) => {
    Division.belongsTo(models.Municipality, {
      foreignKey: "municipalityId",
      as: "municipality",
    });
    Division.hasMany(models.Municipality, {
      foreignKey: "divisionId",
      as: "municipalities",
    });
    Division.hasMany(models.Election, {
      foreignKey: "divisionId",
      as: "elections",
    });
  };

  return Division;
};
