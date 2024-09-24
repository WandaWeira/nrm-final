module.exports = (sequelize, DataTypes) => {
  const DivisionRegistra = sequelize.define("DivisionRegistra", {
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
      validate: {
        isEmail: true,
      },
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

  DivisionRegistra.associate = (models) => {
    DivisionRegistra.belongsTo(models.Division, {
      foreignKey: "divisionId",
      as: "division",
    });
  };

  return DivisionRegistra;
};