module.exports = (sequelize, DataTypes) => {
  const DistrictSIGCouncillorCandidate = sequelize.define(
    "DistrictSIGCouncillorCandidate",
    {
      councillorType: {
        type: DataTypes.ENUM("Youth", "PWD", "Elder"),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
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

  Candidate.hasOne(DistrictSIGCouncillorCandidate);
  DistrictSIGCouncillorCandidate.belongsTo(Candidate);
  return DistrictSIGCouncillorCandidate;
};
