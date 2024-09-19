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

    if (this.hasCity) {
      District.hasMany(models.Division, {
        foreignKey: "districtId",
        as: "divisions",
      });
    } else {
      District.hasMany(models.Constituency, {
        foreignKey: "districtId",
        as: "constituencies",
      });
    }
  };

  return District;
};
