const Order = require("../models/Order");
const Drink = require("../models/Drink");
const mongoose = require("mongoose");
const { json } = require("body-parser");
exports.getIndex = async (req, res) => {
  const order = await Order.find((data) => data);

  try {
    console.log(order);
    // Data rendered as an object and passed down into index.ejs
    // res.status(200).render('index', { anime: anime });

    // Data returned as json so a fetch/axios requst can get it
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};

exports.placeOrder = async (req, res) => {
  var drinks = [];
  for (var i = 0; i < req.body.amountOfDrinks; i++) {
    var drink = new Drink({
      _id: new mongoose.Types.ObjectId(),
      ingredients: req.body.drinks[i].ingredients,
      quantityOfIngredients: req.body.drinks[i].quantityOfIngredients,
      deliveryDate: req.body.drinks[i].deliveryDate,
      color: req.body.drinks[i].color,
      price: req.body.drinks[i].price,
    });
    drinks[i] = drink;
  }
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    user: req.body._id,
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    gateCode: req.body.gateCode,
    suiteNumber: req.body.suiteNumber,
    instructions: req.body.instructions,
    totalCost: req.body.totalCost,
    cupOption: req.body.cupOption,
    amountOfDrinks: req.body.amountOfDrinks,
    drinks: drinks,
  });
  order.save(function (err, result) {
    if (err) {
      console.log(err);
      return res
      .status(200)
      .json({ err });  
    } else {
      console.log("result: ", result);
      for (var j = 0; j < req.body.amountOfDrinks; j++) {
        drinks[j].order = order._id;
        var drink = new Drink(drinks[j]);
        drink.save(function (err, drinkSaved) {
          if (err) {
            console.log(err);
            return res
                .status(200)
                .json({ err });   

          } else {
            console.log("drink: ", drinkSaved);
            if(j == 2){
                return res
                .status(500)
                .json({ order });   
                     }
          }
        });
      }
    }
  });
};

exports.getUserOrders = async (req, res) => {
    var userId = req.query.user;
    console.log(userId)
    console.log(new mongoose.Types.ObjectId(userId))
    Order.estimatedDocumentCount(function (err, docs) {
        if(err){
            console.log(err);
            return;
        }
        console.log(docs)
    })
    Order.find({user: new mongoose.Types.ObjectId(userId)}, function (err, docs) {
        if(err){
            return res.status(500).json({err})
        }
        return res.status(200).json(docs)
    })
  };