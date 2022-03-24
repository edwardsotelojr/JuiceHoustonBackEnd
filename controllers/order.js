
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Drink = require("../models/Drink");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51JdrbbJhLWcBt73zBQd9s8PqqVI6bEwXxQtYvhQ76RRFQbzLpp8rWsgXCFAA6S9yVz4XghTjvbmk30cwfiSOcyrV008BHc9z1w"
);
const moment = require("moment-timezone");
const dateHouston = moment.tz(Date.now(), "America/Chicago");
const nodemailer = require("nodemailer");
const { resolveContent } = require("nodemailer/lib/shared");
const {receiptHtml} = require('../utils/receiptHtml')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "juicedhouston@gmail.com",
    pass: "fytqom-jiWdeh-cosxu6",
  },
});
transporter.verify().then().catch(console.error);
var lastDay = ""

getPlaceDateOrder = () => {
  const dateHouston = moment.tz(Date.now(), "America/Chicago");
  const hour = dateHouston.format("HH");
  //date.setDate(date.getDate() + 7);
  if (hour >= 16) {
    // set date to the next day
    orderPlacedDate = dateHouston.add(8, "hours").format("MM/DD/YYYY");
  }else{
    orderPlacedDate = dateHouston.add(8, "hours").format("MM/DD/YYYY");
  }
  return orderPlacedDate;
};
 
getLastDeliveryDate = (date) => {
  lastDay = moment.tz(date, 'MM/DD/YYYY', true, "America/Chicago").add(7, 'days').format("MM/DD/YYYY")
  return lastDay
}
/* 
orderHasBeenDelivered = () => {
  
} */


exports.orderReceipt = (req, res) => {
  const ht = receiptHtml({name: "edward", address: "217", phone: 2819796377,
   zipcode: 77009, instructions: ""}, [{color: "#17ad00", deliveryDate: "3/8/2021", 
  ingredients: {"fuji apple": 12, "red grapes": 4}, total: 4.50}, 
  {color: "rgb(204, 37, 61)", deliveryDate: "3/8/2021", 
  ingredients: {"fuji apple": 12, "red grapes": 4}, total: 4.50}
  , {color: "rgb(110, 158, 51)", deliveryDate: "3/8/2021", 
  ingredients: {"fuji apple": 12, "red grapes": 4}, total: 4.50},
  {color: "rgb(248, 140, 24)", deliveryDate: "3/8/2021", 
  ingredients: {"fuji apple": 12, "red grapes": 4}, total: 4.50}
  
], 20.00)
  transporter
  .sendMail({
    from: '"Edward" <juicedhouston@gmail.com>', // sender address
    to: "edwardsotelojr@gmail.com", // list of receivers
    subject: "Juice Houston Reciept", // Subject line
    text: "Testing!\n\n ", // plain text body
    html: ht, // html body
  })
  .then((info) => {
    console.log({ info });
    return res.status(200).json({msg: 'success'})
  })
  .catch(console.error);
} 

exports.getIndex = async (req, res) => {
  const order = await Order.find((data) => data);
  try {
    console.log(order);
    // Data rendered as an object and passed down into index.ejs
    // res.status(200).render('index', { anime: anime });
    // Data returned as json so a fetch/axios requst can get it
    res.json(order);
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

placeDrink = async (drinks, orderID) => {
  var ds = []
  var drink;
  var drinkId
  for(var i = 0; i < drinks.length; i++){
    drinkId = new mongoose.Types.ObjectId() 
    drink = new Drink({
      _id: drinkId,
      ingredients: drinks[i].ingredients,
      nutritionalFacts: drinks[i].nutritionalFacts,
      deliveryDate: drinks[i].deliveryDate,
      color: drinks[i].color,
      price: drinks[i].price,
      delivered: false,
      order: orderID
    }).save(function(err, result){
      if(err) {
        console.log("error: ", err)
        return "error"
      } 
      if(result){
        console.log(result._id)
        console.log(ds)
        ds.push(result._id)
        if(i == drinks.length-1){
          return new Promise((resolve, reject) => {
            setTimeout
            console.log("resolve")
            resolve(ds)
          })
        }
      }
    })
  }
}

exports.placeOrder = async (req, res) => {
  const {email, name, phone, address, zipcode, gateCode, suiteNumber, 
  instructions, totalCost, sizeOfOrder, agreement} = req.body
  var drinks = [];
  var drinkIDs = []
  var drinkID
  var count = 0
  const orderID = new mongoose.Types.ObjectId()
  for(var i = 0; i < req.body.drinks.length; i++){
    drinkID = new mongoose.Types.ObjectId()
    drinkIDs.push(drinkID)
    drinks.push(new Drink({
      _id: drinkID,
      ingredients: req.body.drinks[i].ingredients,
      nutritionalFacts: req.body.drinks[i].nutritionalFacts,
      deliveryDate: req.body.drinks[i].deliveryDate,
      color: req.body.drinks[i].color,
      price: req.body.drinks[i].price,
      delivered: false,
      order: orderID
    }))
  }  
  const orderDate = getPlaceDateOrder()
  const lastDay = getLastDeliveryDate(orderDate)
  Drink.insertMany(drinks)
  .then((ds) => {
    console.log("done, ", ds)
    const order = new Order({
      _id: orderID,
      email: email,
      name: name,
      phone: phone,
      address: address,
      zipcode: zipcode,
      gateCode: gateCode,
      suiteNumber: suiteNumber,
      instructions: instructions,
      totalCost: totalCost,
      sizeOfOrder: sizeOfOrder,
      agreement: agreement,
      drinks: drinkIDs,
      lastDay: lastDay,
      orderPlaced: orderDate
    });
    order.save(function (err, result) {
      if (err) {
        console.log("error in order save")
        return res.status(500).json({error: true, msg: err });
      } else {
        console.log("result for order.save: ", result);
        transporter
          .sendMail({
            from: '"Edward" <juicedhouston@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Juice Houston Reciept", // Subject line
            text: "Thank you!\n\n ", // plain text body
            html: receiptHtml({name: name, address: address, phone: phone,
            zipcode: zipcode, instructions: instructions}, req.body.drinks, totalCost), // html body
          })
          .then((info) => {
            console.log("email is sent");
            res.status(200).json({error: false, msg: "success"})
          })
          .catch(erro => {
            console.log("error in email")

            res.status(500).json({msg: erro, error: true})
          });
        ;
      }
    }); 
  }).catch(error => {
    console.log("error in drinks save")
    res.send.json({msg: error, error: true})
  }) 
};

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}  

async function getDrinkk(drinkId) {
  const idd = new mongoose.Types.ObjectId(drinkId);
  //console.log(new Date)
   await Drink.findById(idd)
   .then(doc => {console.log(doc); return doc})
}

exports.getUserOrders = async (req, res) => {
  var userEmail = req.query.email;
    //console.log(new mongoose.Types.ObjectId(userId))
  Order.find({email: userEmail})
  .populate("drinks")
  .exec(function (err, orders) {
    if (err) return console.log(err);
    res.status(200).json({orders});
  });
};

exports.paymentIntent = async (req, res) => {
  const { price } = req.body;
  console.log("here in payment intent: ", price);
  try{
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  }
  catch(err){
    console.log("error on payment Intent: ", err)
    res.status(200).json({msg: "error"})
  }
 
};
