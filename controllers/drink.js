const Drink = require("../models/Drink");
const mongoose = require("mongoose");
const { json } = require("body-parser");

exports.getDrink = async (req, res) => {
    const drinkId = req.query.drinkId;

    //console.log(drinkId)
   const idd = new mongoose.Types.ObjectId(drinkId)
    Drink.findById(idd, function (err, docs) {
        if(err){
            return res.status(500).json({err})
        }
        return res.status(200).json(docs)
    })
  }; 

  exports.drinkDelivered = async (req, res) => {
      const drinkId = req.body.drinkId
      //const objId = new mongoose.Types.ObjectId(drinkId)
      Drink.findByIdAndUpdate({_id: drinkId}, { $set: {"delivered": true}},
      function (err, docs) {
          if(err){
              return res.status(500).json({err})
          } 
           return res.send("delivered")
     })
  }