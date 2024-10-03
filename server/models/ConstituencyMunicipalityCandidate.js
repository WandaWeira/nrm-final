module.exports = (sequelize, DataTypes) => {
  const ConstituencyMunicipalityCandidate = sequelize.define(
    "ConstituencyMunicipalityCandidate",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        allowNull: true,
      },
      subcounty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parish: {
        type: DataTypes.STRING,
        allowNull: true,
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
      constituencyMunicipalityElectionType: {
        type: DataTypes.ENUM("mps"),
        allowNull: false,
      },
      isQualified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    }
  );

  ConstituencyMunicipalityCandidate.associate = (models) => {
    ConstituencyMunicipalityCandidate.belongsTo(models.Candidate, {
      foreignKey: "candidateId",
    });
  };

  return ConstituencyMunicipalityCandidate;
};
