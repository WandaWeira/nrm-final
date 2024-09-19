module.exports = (sequelize, DataTypes) => {
    const PollingStation = sequelize.define("PollingStation", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    PollingStation.associate = (models) => {
        PollingStation.belongsTo(models.Parish, {
            foreignKey: 'parishId',
            as: 'parish'
        });
    };

    return PollingStation;
};




