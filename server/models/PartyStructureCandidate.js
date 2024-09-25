module.exports = (sequelize, DataTypes) => {
  const PartyStructureCandidate = sequelize.define("PartyStructureCandidate", {
    partyPosition: {
      //This is the position you are contesting for
      type: DataTypes.STRING,
      allowNull: false,
    },
    partyLevel: {
      //This is administrative unit
      type: DataTypes.STRING,
      allowNull: false,
    },
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

  PartyStructureCandidate.associate = (models) => {
    models.Candidate.hasOne(PartyStructureCandidate);
    PartyStructureCandidate.belongsTo(models.Candidate);
  };

  return PartyStructureCandidate;
};

// {
//     "electionType": "partyStructure",
//     "ninNumber": "CM12345678",
//     "firstName": "John",
//     "lastName": "Doe",
//     "phoneNumber": "+256123456789",
//     "partyStructureData": {
//       "partyPosition": "Secretary General",
//       "partyLevel": "National",
//       "district": "Kampala",
//       "constituency": "Central Division",
//       "subcounty": "Kampala Central",
//       "parish": "Nakasero"

//     }
//   }
