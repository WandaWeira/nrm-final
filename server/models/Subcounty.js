module.exports = (sequelize, DataTypes) => {
  const Subcounty = sequelize.define("Subcounty", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // nrmRegistra: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
  });

  Subcounty.associate = (models) => {
    Subcounty.belongsTo(models.Constituency, {
      foreignKey: "constituencyId",
      as: "constituency",
    });
    Subcounty.hasMany(models.Parish, {
      foreignKey: "subcountyId",
      as: "parishes",
    });
  };

  return Subcounty;
};
