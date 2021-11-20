
const {MONGO_URI} = require('./keys.js');
const routes = require("./routes/");
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;
const passport = require("passport");
const cors = require('cors')
const dotenv = require('dotenv').config()
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//middlewares
app.use(bodyParser.json());

// root
// mongo password: pegvI3-puxnok-wymmuc
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("Mongoose Connected. ");
})
.catch(err => console.log(err));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


