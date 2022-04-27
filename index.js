require('dotenv').config()
const routes = require("./routes/");
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose");
require('./models/Drink');
const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cors = require('cors')

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
app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


