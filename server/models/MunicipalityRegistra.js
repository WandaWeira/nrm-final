module.exports = (sequelize, DataTypes) => {
    const MunicipalityRegistra = sequelize.define("MunicipalityRegistra", {
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
        defaultValue: true,
      },
    });
  
    MunicipalityRegistra.associate = (models) => {
      MunicipalityRegistra.belongsTo(models.Municipality, {
        foreignKey: "municipalityId",
        as: "municipality",
      });
    };
  
    return MunicipalityRegistra;
  };