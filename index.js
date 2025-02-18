const express = require("express");
require('dotenv').config();
var bodyParser = require('body-parser')
var cors = require('cors')
const databse = require("./config/database");


const routeClient = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

app.use(cors())

databse.connect();

// parse application/json
app.use(bodyParser.json())

// Routes Version 1 
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});