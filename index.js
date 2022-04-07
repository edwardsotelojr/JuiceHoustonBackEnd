require('dotenv').config()
const routes = require("./routes/");
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cors = require('cors')
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//middlewares
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("Mongoose Connected. ");
})
.catch(err => console.log(err));
require('./models/Drink');
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


