module.exports = (sequelize, DataTypes) => {
    const NationalLevel = sequelize.define("NationalLevel", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    NationalLevel.associate = (models) => {
        NationalLevel.hasMany(models.Election, {
            foreignKey: 'nationalLevelId',
            as: 'elections'
        });
    };

    return NationalLevel;
};
