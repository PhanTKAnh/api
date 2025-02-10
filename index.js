const express = require("express");
require('dotenv').config();
const app = express();
const port = 3001;
const databse = require("./config/database");
var cors = require('cors')
databse.connect();

const routeClient = require("./api/v1/routes/index.route");
app.use(cors())

routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});