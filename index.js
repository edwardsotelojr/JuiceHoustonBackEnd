require('dotenv').config()
const path = require('path');
const fs = require("fs");
const http = require("http");
const https = require("https");
const routes = require("./routes/");
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose");
require('./models/Drink');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cors = require('cors');
const options = {
   cert: fs.readFileSync("/etc/letsencrypt/live/juicedhouston.com/cert.pem"),
   key: fs.readFileSync("privkey.pem"),
   ca: fs.readFileSync("/etc/letsencrypt/live/juicedhouston.com/chain.pem")
}
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.send(path.join(__dirname, 'build', 'index.html'));
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).then(() => {
  console.log("Mongoose Connected. ");
}).catch(err => {
  console.log("error mongoose: ", err)
})
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//middlewares
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
http.createServer(app).listen(8081, () => {
   console.log("http server is running on Port: " + 8081);
})
https.createServer(options, app).listen(8080, () => {
  console.log("httpsserver is running on Port: " + 8080);
});
