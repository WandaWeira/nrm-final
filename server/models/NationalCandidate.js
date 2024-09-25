module.exports = (sequelize, DataTypes) => {
  const NationalCandidate = sequelize.define("NationalCandidate", {
    category: {
      type: DataTypes.STRING,
      allowNull: true,
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
    nationalElectionType: {
      type: DataTypes.ENUM(
        "cec",
        "leagues",
        "presidential",
        "sigmps",
        "eala",
        "speakership",
        "parliamentaryCaucus"
      ),
      allowNull: false,
    },
  });

  Candidate.hasOne(NationalCandidate);
  NationalCandidate.belongsTo(Candidate);
  return NationalCandidate;
};

// {
//     "electionType": "national",
//     "ninNumber": "CM87654321",
//     "firstName": "Jane",
//     "lastName": "Smith",
//     "phoneNumber": "+256987654321",
//     "nationalData": {
//       "category": "CEC",
//       "nationalElectionType": "cec",
//       "region": "Central",
//       "subregion": "Greater Kampala",
//       "district": "Kampala",
//       "constituency": "Kampala Central",
//       "subcounty": "Kampala Central",
//       "parish": "Kololo",
//       "village": "Kololo I",
//       "municipality": "Kampala Capital City Authority",
//       "division": "Central Division",
//       "ward": "Kololo I",
//       "cell": "Upper Kololo"
//     }
//   }
