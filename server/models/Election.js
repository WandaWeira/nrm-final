module.exports = (sequelize, DataTypes) => {
    const Election = sequelize.define("Election", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Election.associate = (models) => {
        Election.belongsTo(models.District, {
            foreignKey: 'districtId',
            as: 'district'
        });
        Election.belongsTo(models.Division, {
            foreignKey: 'divisionId',
            as: 'division'
        });
        Election.belongsTo(models.Municipality, {
            foreignKey: 'municipalityId',
            as: 'municipality'
        });
        Election.belongsTo(models.Ward, {
            foreignKey: 'wardId',
            as: 'ward'
        });
        Election.belongsTo(models.Cell, {
            foreignKey: 'cellId',
            as: 'cell'
        });
        Election.belongsTo(models.Constituency, {
            foreignKey: 'constituencyId',
            as: 'constituency'
        });
        Election.belongsTo(models.Subcounty, {
            foreignKey: 'subcountyId',
            as: 'subcounty'
        });
        Election.belongsTo(models.Parish, {
            foreignKey: 'parishId',
            as: 'parish'
        });
        Election.belongsTo(models.Village, {
            foreignKey: 'villageId',
            as: 'village'
        });
        Election.belongsTo(models.NationalLevel, {
            foreignKey: 'nationalLevelId',
            as: 'nationalLevel'
        });
        Election.hasMany(models.Candidate, {
            foreignKey: 'electionId',
            as: 'candidates'
        });
        // Ensure the association with Opposition
        Election.hasMany(models.Opposition, {
            foreignKey: 'electionId',
            as: 'oppositions'
        });
    };

    return Election;
};


