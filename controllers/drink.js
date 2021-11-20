const Drink = require("../models/Drink");
const mongoose = require("mongoose");
const { json } = require("body-parser");

exports.getDrink = async (req, res) => {
    var drinkId = req.query.drinkId;

    //console.log(drinkId)
   const idd = new mongoose.Types.ObjectId(drinkId)
    Drink.findById(idd, function (err, docs) {
        if(err){
            return res.status(500).json({err})
        }
        return res.status(200).json(docs)
    })
  }; 