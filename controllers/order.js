const Order = require("../models/Order");
const Drink = require("../models/Drink");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const { getDrink } = require("./drink");
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51JdrbbJhLWcBt73zBQd9s8PqqVI6bEwXxQtYvhQ76RRFQbzLpp8rWsgXCFAA6S9yVz4XghTjvbmk30cwfiSOcyrV008BHc9z1w');

const nodemailer = require('nodemailer');
const { resolveContent } = require("nodemailer/lib/shared");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'juicedhouston@gmail.com',
    pass: 'fytqom-jiWdeh-cosxu6',
  },
});
transporter.verify().then().catch(console.error);


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

exports.placeOrder = async (req, res) => {
  var drinks = [];
  var drink;
  for (var i = 0; i < req.body.sizeOfOrder; i++) {
    drink = new Drink({
      _id: new mongoose.Types.ObjectId(),
      ingredients: req.body.drinks[i].ingredients,
      nutritionalFacts: req.body.drinks[i].nutritionalFacts,
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
    sizeOfOrder: req.body.sizeOfOrder,
    agreement: req.body.agreement,
    drinks: drinks,
  });
  order.save(function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });
    } else {
      console.log("result: ", result);
      for (var j = 0; j < req.body.sizeOfOrder; j++) {
        drinks[j].order = order._id;
        var drink = new Drink(drinks[j]);
        drink.save(function (err, drinkSaved) {
          if (err) { 
            console.log(err);
            /* const session = await stripe.checkout.sessions.create({

                  payment_method_types: [
                    'card',
                  ],
                  mode: 'payment',
                  success_url: `${YOUR_DOMAIN}?success=true`,
                  cancel_url: `${YOUR_DOMAIN}?canceled=true`,
                });
             */
            return res.status(200).json({ err });
          }
        });
      } 
      transporter.sendMail({
        from: '"Edward" <juicedhouston@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Juice Houston Reciept", // Subject line
        text: "Thank you!\n\n ", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
      }).then(info => {
        console.log({info});
      }).catch(console.error);
      return res.status(200).json({ "result": "success" });

    }
  });
};

async function getDrinkk(drinkId) {
  const idd = new mongoose.Types.ObjectId(drinkId);
  //console.log(new Date)
  await Drink.findById(idd, function (err, docs) {
    if (err) {
      return { err };
    }
   // console.log("\n docs: ", docs, " " , new Date);
    return docs;
  }); 
};

exports.getUserOrders = async (req, res) => {
  var userEmail = req.query.email;
  var drinksArray = [];
  var docsCopy = [];
  var resSend = 0
  //console.log(userId)
  //console.log(new mongoose.Types.ObjectId(userId))

  //let orders = await Order.find({email: userEmail})
  //.populate("drinks")
  Order.find(
    { email: userEmail },
    async function (err, docs) {
      if (err) {
        return res.status(500).json({ err });
      }
      docs.forEach((o,i) => {
        docsCopy.push(o.toObject())
        docsCopy[i]["drinkss"] = []
      })
    }
  ).then(
    orders => {
      var b = new Promise((resolve, reject) =>{
        orders.forEach(async (o, i) => {
        o.drinks.forEach(async (d, ii) => {
          const drink = await Drink.findById(d._id, function (err, dri) {
            if (err) {
              return { err };
            }
            console.log("here")
              docsCopy[i]["drinkss"][ii] = dri
              if(i == orders.length-1 && ii == o.drinks.length-1) {return setTimeout(() => {resolve()}, 1000)
              }
          }); 
        })
      })
      })
      .then(()=> {
        return res.send(docsCopy)
           
   })
    })
}; 

exports.paymentIntent = async (req, res) => {
  const { price } = req.body;
  console.log("here in payment intent")
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};