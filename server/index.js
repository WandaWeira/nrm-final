const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cors = require("cors");

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use(express.json());

require("dotenv").config();

const db = require("./models");

const userRoutes = require("./routes/User");
app.use("/user", userRoutes);

const authRoutes = require("./routes/Auth");
app.use("/auth", authRoutes);

const regionRoutes = require("./routes/Region");
app.use("/regions", regionRoutes);

const subregionRoutes = require("./routes/Subregion");
app.use("/subregions", subregionRoutes);

const districtRoutes = require("./routes/District");
app.use("/districts", districtRoutes);

const constituencyRoutes = require("./routes/Constituency");
app.use("/constituencies", constituencyRoutes);

const divisionRoutes = require("./routes/Division");
app.use("/divisions", divisionRoutes);

const municipalitiesRoutes = require("./routes/Municipality");
app.use("/municipalities", municipalitiesRoutes);

const wardRoutes = require("./routes/Ward");
app.use("/wards", wardRoutes);

const cellRoutes = require("./routes/Cell");
app.use("/cells", cellRoutes);

const subcountyRoutes = require("./routes/Subcounty");
app.use("/subcounties", subcountyRoutes);

const parishRoutes = require("./routes/Parish");
app.use("/parishes", parishRoutes);

const villageRoutes = require("./routes/Village");
app.use("/villages", villageRoutes);

const ElectoralPositionsRoutes = require("./routes/ElectoralPositionsRoutes");
app.use("/electoral-positions", ElectoralPositionsRoutes);

const PollingStationRoutes = require("./routes/PollingStation");
app.use("/polling-stations", PollingStationRoutes);

db.sequelize.sync().then(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
