module.exports = (sequelize, DataTypes) => {
  const LocalCouncilCandidate = sequelize.define("LocalCouncilCandidate", {
    lcLevel: {
        type: DataTypes.ENUM('LC1', 'LC2', 'LC3', 'LCV'),
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
  });

  Candidate.hasOne(LocalCouncilCandidate);
  LocalCouncilCandidate.belongsTo(Candidate);
  return LocalCouncilCandidate;
};

// {
//     "electionType": "localCouncil",
//     "ninNumber": "CM98765432",
//     "firstName": "Alice",
//     "lastName": "Johnson",
//     "phoneNumber": "+256789012345",
//     "localCouncilData": {
//       "lcLevel": "LC1",
//       "village": "Bukoto",
//       "parish": "Bukoto",
//       "subcounty": "Nakawa",
//       "district": "Kampala",
//       "position": "Chairperson",
//       "term": "2023-2028",
//       "politicalParty": "NRM",
//       "previousExperience": "Village Health Team Leader",
//       "educationLevel": "Diploma",
//       "dateOfBirth": "1985-06-15"
//     }
//   }