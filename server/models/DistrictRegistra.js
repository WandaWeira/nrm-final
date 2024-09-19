module.exports = (sequelize, DataTypes) => {
  const DistrictRegistra = sequelize.define("DistrictRegistra", {
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
    },
  });

  DistrictRegistra.associate = (models) => {
    DistrictRegistra.belongsTo(models.District, {
      foreignKey: "districtId",
      as: "district",
    });
  };

  return DistrictRegistra;
};
