module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define("District", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hasCity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  District.associate = (models) => {
    District.belongsTo(models.Subregion, {
      foreignKey: "subregionId",
      as: "subregion",
    });

    // City Structure: District -> Municipalities -> Divisions -> Wards -> Cells
    District.hasMany(models.Municipality, {
      foreignKey: "districtId",
      as: "municipalities",
    });

    // Non-City Structure: District -> Constituencies
    District.hasMany(models.Constituency, {
      foreignKey: "districtId",
      as: "constituencies",
    });
  };

  return District;
};
