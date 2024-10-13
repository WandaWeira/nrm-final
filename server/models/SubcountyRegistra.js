module.exports = (sequelize, DataTypes) => {
  const SubcountyRegistra = sequelize.define("SubcountyRegistra", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ninNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  SubcountyRegistra.associate = (models) => {
    SubcountyRegistra.belongsTo(models.Subcounty, {
      foreignKey: "subcountyId",
      as: "subcounty",
    });
  };

  return SubcountyRegistra;
};