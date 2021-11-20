const { JWT_SECRET } = require("../keys.js");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51JdrbbJhLWcBt73zBQd9s8PqqVI6bEwXxQtYvhQ76RRFQbzLpp8rWsgXCFAA6S9yVz4XghTjvbmk30cwfiSOcyrV008BHc9z1w');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const client = require('twilio')(accountSid, authToken);

exports.verify = async(req, res) => {
  let pin = req.body.pin;
  let userEmail = req.body.userEmail;
  User.findOne({email: userEmail})
  .then(user => {
    if(user){
      let code = user.verificationCode
      if(code == pin){
        console.log("code = pin")
        User.updateOne({email: user.email}, {$set: {verified: true, verificationAttempt: 0}})
        .then(()=> res.status(200).json({msg: "pin matched"}))
      }
      else{
        let verificationAttemptt = parseInt(user.verificationAttempt) + 1
        console.log(verificationAttemptt)
        console.log("code != pin")
        if(user.verificationAttempt == 2){ //delete user 
          User.deleteOne({email: userEmail},function(err){
            if(err)
            {
                res.send(err);
            }
            else{
                res.send("deleted");
            }})
          }
        User.updateOne({email: user.email}, {$set: {verified: false, verificationAttempt: verificationAttemptt}})
        .then(() => res.send("error"))

      }
    }
  })
}

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.login = async (req, res) => {
  console.log("entered login() controller");
  let { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user === null) {
      res.status(400).json({ msg: "invalid email" });
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            user
          };
          // Sign token
          jwt.sign(
            payload,
            JWT_SECRET,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res 
            .status(400)
            .json({ msg: "Password incorrect" });
        }
      });
    }
  });
};

getVerificationCode = () => {
  return 34;
}

exports.signup = async (req, res) => {
  const { email, name, password, phone, address, zipcode, gatecode,
      suiteNumber, instructions, agreement } = req.body

  User.findOne({email: email})
  .then(user => {
    if(user){
      return res.status(400).json({error: "email already exists"});
    }
    const vCode = getVerificationCode()
    const newUser = new User({
      email: email,
      name: name,
      password: password,
      phone: phone, 
      address: address,
      zipcode: zipcode,
      gatecode: gatecode,
      suiteNumber: suiteNumber,
      instructions: instructions,
      verificationCode: vCode
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save()
        .then(user => {
          let body = "Thank you for signing up with Juice Houston! Your code is " + String(34)
          client.messages
             .create({to: user.phone, from: twilioPhoneNumber, body: body})
             .then(message => console.log(message.sid));
          res.json(user)})
        .catch(err => console.log(err));
      });
    });
    
 
  });
};

exports.edit = async (req, res) =>{
  const { _id } = req.params;

  User.findOneAndUpdate({_id: _id},
     {"$set": req.body
    },{ new: true }, (err, updatedUser) => 
      {
        if(err){
          console.log('err: ', err)
        }
        else if(updatedUser) {
        console.log(`Successfully updated document: ${updatedUser}.`);
        res.send(updatedUser);
        }
      })
    }
/* 
const signup = async (req, res) => {
  console.log(req)
    try {
        const payload = req.body;
        const token = await UserServices.signInUser(payload);
        res.status(200).json({
          success: true,
          data: savedUser,
        });
      } catch (error) {
        console.log(error);
        next(new Error(error.message));
      }    
};

const editUser = (req, res) => {
  console.log(req.params)
  User.findByIdAndUpdate(req.params._id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('User updated successfully !')
    }
  })
}

 const signin = (req, res) => {

   const email = req.body.email;
   const password = req.body.password;

   User.findOne({email})
   .then(user => {
     if(!user){
       return res.status(404).json({emailnotfound: "Email not found"});
      }
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch){
          const payload = {
            id: user.id,
            name: user.name
          };
          jwt.sign(
            payload,
            JWT_SECRET,
            {
              expiresIn: 31556926
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer: " + token
              });
            } 
          );
        } else {
          return res
          .status(400)
          .json({passwordincorrect: "Password incorrect"});
        }
      });
    });
}; */
