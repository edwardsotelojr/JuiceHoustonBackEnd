const Order = require("../models/Order");
const Drink = require("../models/Drink");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const { getDrink } = require("./drink");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51JdrbbJhLWcBt73zBQd9s8PqqVI6bEwXxQtYvhQ76RRFQbzLpp8rWsgXCFAA6S9yVz4XghTjvbmk30cwfiSOcyrV008BHc9z1w"
);
const moment = require("moment-timezone");
const dateHouston = moment.tz(Date.now(), "America/Chicago");
const nodemailer = require("nodemailer");
const { resolveContent } = require("nodemailer/lib/shared");
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
  let orderPlacedDate;
  //date.setDate(date.getDate() + 7);
  if (hour >= 16) {
    // set date to the next day
    orderPlacedDate = dateHouston.add(8, "hours");
  }
  console.log("orderPlacedDate: ", orderPlacedDate)
  getLastDelivery(orderPlacedDate)
  return orderPlacedDate;
};

getLastDelivery = (date) => {
  lastDay = moment.tz(date, 'MM/DD/YYYY', true, "America/Chicago").add(7, 'days').format("MM/DD/YYYY")
}
/* 
orderHasBeenDelivered = () => {
  
} */

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


placeDrink = (d, orderID) => {
  
  drink = new Drink({
    _id: new mongoose.Types.ObjectId(),
    ingredients: d.ingredients,
    nutritionalFacts: d.nutritionalFacts,
    deliveryDate: d.deliveryDate,
    color: d.color,
    price: d.price,
    delivered: false,
    order: orderID
  });
  let error = drink.validateSync();
  for( const [key, value] of Object.entries(error)){
    console.log(value)
  }
 //console.log(error.errors)
  return drink
  /* drink.save(function (err, drinkSaved) {
    if (err) {
      console.log("error with drink save")
      return res.status(500).json({msg: "delivery date"})
    }
    else{
      console.log("drinkSaved: ", drinkSaved)
      return drinkSaved
    }
  }) */

    
}

exports.placeOrder = async (req, res) => {
  var drinks = [];
  var drink;
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
    lastDeliveryDate: lastDay,
    orderPlaced: getPlaceDateOrder()
  });
  drink = placeDrink({
    _id: new mongoose.Types.ObjectId(),
    ingredients: req.body.drinks[0].ingredients,
    nutritionalFacts: req.body.drinks[0].nutritionalFacts,
    deliveryDate: req.body.drinks[0].deliveryDate,
    color: req.body.drinks[0].color,
    price: req.body.drinks[0].price,
    delivered: false
  }, order.id)
  console.log(drink)
  /* order.save(function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });
    } else {
      console.log("result: ", result);
   
      transporter
        .sendMail({
          from: '"Edward" <juicedhouston@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Juice Houston Reciept", // Subject line
          text: "Thank you!\n\n ", // plain text body
          html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
        })
        .then((info) => {
          console.log({ info });
        })
        .catch(console.error);
      ;
    }
  }); */
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
}

exports.getUserOrders = async (req, res) => {
  var userEmail = req.query.email;
  var drinksArray = [];
  var docsCopy = [];
  var resSend = 0;
  //console.log(new mongoose.Types.ObjectId(userId))

  //let orders = await Order.find({email: userEmail})
  //.populate("drinks")
  Order.find({ email: userEmail }, async function (err, docs) {
    if (err) {
      return res.status(500).json({ err });
    }
    console.log(docs)
    if(docs.length == 0) return res.send([])
    docs.forEach((o, i) => {
      docsCopy.push(o.toObject());
      docsCopy[i]["drinkss"] = [];
    });
  }).then((orders) => {
    var b = new Promise((resolve, reject) => {
      orders.forEach(async (o, i) => {
        o.drinks.forEach(async (d, ii) => {
          const drink = await Drink.findById(d._id, function (err, dri) {
            if (err) {
              return { err };
            }
            console.log("here");
            docsCopy[i]["drinkss"][ii] = dri;
            if (i == orders.length - 1 && ii == o.drinks.length - 1) {
              return setTimeout(() => {
                resolve();
              }, 1000);
            }
          });
        });
      });
    }).then(() => {
      return res.send(docsCopy);
    });
  });
};

exports.paymentIntent = async (req, res) => {
  const { price } = req.body;
  console.log("here in payment intent: ", price);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
