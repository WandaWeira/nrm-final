module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define("Candidate", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ninNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        votes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    Candidate.associate = (models) => {
        Candidate.belongsTo(models.Election, {
            foreignKey: 'electionId',
            as: 'election'
        });
        Candidate.belongsTo(models.User, {
            foreignKey: 'nominatedBy',
            as: 'nominator'
        });
    };

    return Candidate;
};
