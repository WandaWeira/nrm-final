module.exports = (sequelize, DataTypes) => {
    const ConstituencyRegistra = sequelize.define("ConstituencyRegistra", {
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
  
    ConstituencyRegistra.associate = (models) => {
      ConstituencyRegistra.belongsTo(models.Constituency, {
        foreignKey: "constituencyId",
        as: "constituency",
      });
    };
  
    return ConstituencyRegistra;
  };