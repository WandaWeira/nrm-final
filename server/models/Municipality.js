module.exports = (sequelize, DataTypes) => {
  const Municipality = sequelize.define("Municipality", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrmRegistra: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Municipality.associate = (models) => {
    Municipality.belongsTo(models.District, {
      foreignKey: "districtId",
      as: "district",
    });
    Municipality.hasMany(models.Ward, {
      foreignKey: "municipalityId",
      as: "wards",
    });
    Municipality.hasMany(models.Election, {
      foreignKey: "municipalityId",
      as: "elections",
    });
  };

  return Municipality;
};
