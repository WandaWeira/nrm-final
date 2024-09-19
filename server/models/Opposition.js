module.exports = (sequelize, DataTypes) => {
    const Opposition = sequelize.define("Opposition", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ninNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        party: {
            type: DataTypes.STRING,
            allowNull: false
        },
        electionType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        votes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    Opposition.associate = (models) => {
        Opposition.belongsTo(models.Candidate, {
            foreignKey: 'winnerId',
            as: 'winner'
        });
        Opposition.belongsTo(models.Election, {
            foreignKey: 'electionId',
            as: 'election'
        });
    };

    return Opposition;
};
