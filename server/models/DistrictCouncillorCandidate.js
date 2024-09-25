module.exports = (sequelize, DataTypes) => {
  const DistrictCouncillorCandidate = sequelize.define(
    "DistrictCouncillorCandidate",
    {
      councillorType: {
        type: DataTypes.ENUM("Direct Councillor", "Female Councillor"),
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subregion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      constituency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subcounty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parish: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      village: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      municipality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      division: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ward: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cell: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }
  );

  DistrictCouncillorCandidate.associate = (models) => {
    models.Candidate.hasOne(DistrictCouncillorCandidate);
    DistrictCouncillorCandidate.belongsTo(models.Candidate);
  };

  return DistrictCouncillorCandidate;
};
