module.exports = (sequelize, DataTypes) => {
  const Constituency = sequelize.define("Constituency", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Constituency.associate = (models) => {
    Constituency.belongsTo(models.District, {
      foreignKey: "districtId",
      as: "district",
    });
    Constituency.hasMany(models.Subcounty, {
      foreignKey: "constituencyId",
      as: "subcounties",
    });
  };

  return Constituency;
};
