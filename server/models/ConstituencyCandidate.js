module.exports = (sequelize, DataTypes) => {
  const ConstituencyCandidate = sequelize.define("ConstituencyCandidate", {
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

  ConstituencyCandidate.associate = (models) => {
    models.Candidate.hasOne(ConstituencyCandidate);
    ConstituencyCandidate.belongsTo(models.Candidate);
  };

  return ConstituencyCandidate;
};
