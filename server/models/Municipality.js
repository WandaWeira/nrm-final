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
    Municipality.hasMany(models.Division, {
      foreignKey: "municipalityId",
      as: "divisions",
    });
  };

  return Municipality;
};
