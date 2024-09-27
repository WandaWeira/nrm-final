module.exports = (sequelize, DataTypes) => {
    const ParishRegistra = sequelize.define("ParishRegistra", {
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
  
    ParishRegistra.associate = (models) => {
        ParishRegistra.belongsTo(models.Parish, {
        foreignKey: "parishId",
        as: "parish",
      });
    };
  
    return ParishRegistra;
  };
  