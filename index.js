const express = require("express");
require('dotenv').config();
var bodyParser = require('body-parser')
var cors = require('cors')
const cookieParser = require("cookie-parser");
const databse = require("./config/database");


const routeClient = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  "http://localhost:3000", // Cho phép chạy local
  "https://it-carer.vercel.app" // Thay bằng domain thực tế của bạn trên Vercel
]; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true // Bật gửi cookie giữa frontend & backend
}));


databse.connect();

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser('DBVFWFGVSGH'));


// Routes Version 1 
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});