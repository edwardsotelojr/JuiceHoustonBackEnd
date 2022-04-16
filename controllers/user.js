require('dotenv').config()
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  validationSignup,
  validationResetPassword,
  validation
} = require("../utils/validation");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

transporter.verify().then().catch(console.error);

exports.verify = async (req, res) => {
  let pin = parseInt(req.body.pin);
  let userEmail = req.body.userEmail;
  var userPin;
  console.log("verify parameters: ", req.body);
  User.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        userPin = user.verificationCode;
        console.log("founded user", pin, userPin);
        if (userPin == pin) {
          console.log("code = pin");
          User.updateOne(
            { email: user.email },
            { $set: { verified: true, verificationAttempt: 0 } }
          ).then(() => {
            var userr = user;
            delete userr.verified;
            delete userr.verificationAttempt;
            jwt.sign(
              { user: userr },
              process.env.JWT_SECRET,
              {
                expiresIn: 31556925,
              },
              (err, token) => {
                res.json({
                  success: true,
                  msg: "pin matched",
                  token: token,
                  user: userr,
                });
              }
            );
          });
        } else {
          // pin is not a match
          console.log("no match");
          let verificationAttemptt = parseInt(user.verificationAttempt) + 1;
          if (user.verificationAttempt == 2) {
            User.deleteOne({ email: userEmail }, function (err) {
              if (err) {
                res.json({ msg: "error to delete user", err });
              } else {
                res.json({ msg: "user is deleted" });
              }
            });
          } else {
            console.log("verificationAttemptt: ", verificationAttemptt);
            User.updateOne(
              { email: user.email },
              {
                $set: {
                  verified: false,
                  verificationAttempt: verificationAttemptt,
                },
              },
              { returnOriginal: false },
              function (err, documents) {
                res.json({
                  msg: "incorrect pin",
                  attemptsLeft: verificationAttemptt,
                });
              }
            );
          }
        }
      } else {
        res.json({ msg: "user not founded" });
      }
    })
    .catch((err) => res.json({ msg: "user not founded", err }));
};

exports.loginAfterVerified = async (req, res) => {
  const user = res.body.user;

  const payload = {
    user,
  };
  jwt.sign(
    payload,
    proces.env.JWT_SECRET,
    {
      expiresIn: 31556925,
    },
    (err, token) => {
      res.json({
        success: true,
        token: "Bearer " + token,
        user: user,
      });
    }
  );
};

exports.login = async (req, res) => {
  console.log("entered login() controller");
  let { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user === null) {
      console.log("invalid");
      res.status(400).json({ msg: "invalid email" });
    } else if (user.verified == false) {
      console.log("not verified");
      res.status(400).json({ msg: "user not verified" });
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            user,
          };
          // Sign token
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user: user,
              });
            }
          );
        } else {
          console.log("incorrect");
          return res.status(400).json({ msg: "Password incorrect" });
        }
      });
    }
  });
};

getVerificationCode = () => {
  let fourCode = [];
  let code = "";

  for (let i = 0; i < 4; i++) {
    fourCode.push(Math.floor(Math.random() * 9) + 1);
    code = code + fourCode[i].toString();
  }
  return parseInt(code);
};

exports.signup = async (req, res) => {
  const {
    email,
    name,
    password,
    phone,
    address,
    zipcode,
    gateCode,
    suiteNumber,
    instructions,
    termsOfAgreement,
  } = req.body;
  const v = validationSignup(
    email,
    name,
    password,
    phone,
    address,
    zipcode,
    gateCode,
    suiteNumber,
    instructions,
    termsOfAgreement
  );
  if (v.status == 500) {
    console.log("failed", v.msg);
    return res.status(500).json({ msg: v.msg });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.status(400).json({ msg: "Email already exist" });
      }
      const vCode = getVerificationCode();
      const newUser = new User({
        email: email,
        name: name,
        password: password,
        phone: phone,
        address: address,
        zipcode: zipcode,
        gatecode: gateCode,
        suiteNumber: suiteNumber,
        instructions: instructions,
        verificationCode: vCode,
        termsOfAgreement: termsOfAgreement,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          let body =
            "Thank you for signing up with Juice Houston! Your code is " +
            vCode;
          client.messages
            .create({
              to: phone.toString(),
              from: twilioPhoneNumber.toString(),
              body: body,
            })
            .then((message) => {
              console.log("sid: " + message.sid);
              newUser
                .save()
                .then((user) => {
                  res.status(200).json({ msg: "success", user });
                })
                .catch((err) => {
                  console.log("err: " + err);
                  res.status(500).json({ msg: "error on saving user", err });
                });
            })
            .catch((err) => {
              console.log("err with twilio: " + err);
              transporter
                .sendMail({
                  from: '"Edward" <juicedhouston@gmail.com>', // sender address
                  to: "edwardsotelojr@gmail.com", // list of receivers
                  subject: "Twilio error within signin", // Subject line
                  text: "authenticate error code. might be auth token, sid or phone number", // plain text body
                })
                .then((info) => {
                  console.log({ info });
                })
                .catch((error) => {
                  res.status(500).json({ msg: "error with mailer" });
                });
              res
                .status(500)
                .json({ msg: "error with server", err: err.Error });
            });
        });
      });
    });
  }
};

exports.edit = async (req, res) => {
  const { _id } = req.params;
  const { name, phone, address, zipcode, gateCode, suiteNumber, instructions } =
    req.body;
  const v = validation(
    name,
    phone,
    address,
    zipcode,
    gateCode,
    suiteNumber,
    instructions
  );

  if (v.status == 500) {
    console.log("failed", v.msg);
    return res.status(500).json({ msg: v.msg });
  } else {
    User.findOneAndUpdate(
      { _id: _id },
      { $set: req.body },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.log("err: ", err);
        } else if (updatedUser) {
          const payload = {
            updatedUser,
          };
          console.log(`Successfully updated document: ${updatedUser}.`);
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              console.log("token: ", token);
              res.json({
                success: true,
                token: "Bearer " + token,
                user: updatedUser,
              });
            }
          );
        }
      }
    );
  }
};

exports.resetPassword = async (req, res) => {
  console.log("32");
  const { email, password, newPassword } = req.body;
  if (validationResetPassword(newPassword)) {
    User.findOne({ email: email })
      .then((user) => {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {console.log("err"); throw err;}
              bcrypt.hash(newPassword, salt, (errors, hash) => {
                if (err) {console.log("error"); throw errors;}
                User.updateOne({ email: email }, { password: hash })
                  .then((r) => {
                    console.log("new password saved");
                    res
                      .status(200)
                      .json({ error: false, msg: "password updated" });
                  })
                  .catch((error) => {
                    console.log("error on updateOne: ", error);
                    res.status(200).json({ error: true, msg: "error" });
                  });
              });
            });
          } else {
            console.log("incorrect current password ");
            res
              .status(200)
              .json({ error: true, msg: "incorrect current password" });
          }
        });
      })
      .catch((error) => {
        console.log("error on find one: ", error);
        res.status(200).json({ error: true, msg: "error" });
      });
  } else {
    console.log("invalid new pasword")
    res.status(200).json({
      error: true,
      msg: "invalid new password",
    });
  }
};

const setPassword = (email, password) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (errors, hash) => {
      if (err) throw errors;
      User.updateOne({ email: email }, { password: hash })
        .then((r) => {
          console.log("new password saved");
          return r
        })
        .catch((error) => {
          console.log("error on updateOne: ", error);
          return error
        });
    });
  });
};

const randomPassword = () => {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
};
exports.sendTemporaryPassword = async (req, res) => {
  const r = randomPassword();
  const email = req.body.email;
  const phone = req.body.phone;
  const text = "Your new password for juice houston is " + r;
  const emailText = "Your new password for juice houston is " + r;
  client.messages
    .create({
      to: phone.toString(),
      from: twilioPhoneNumber.toString(),
      body: text,
    })
    .then((message) => {
      console.log("sid: " + message.sid);
      transporter
        .sendMail({
          from: '"Edward" <juicedhouston@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "New Password", // Subject line
          text: emailText, // plain text body
        })
        .then((info) => {
          console.log({ info });
          const setPasswordReturn = setPassword(email, r)
          console.log(setPasswordReturn)
          res.status(200).json({msg: "temporary password sent"})
        })
        .catch((error) => {
          res.status(500).json({ msg: "error with mailer" });
        });
    })
    .catch((err) => {
      console.log("err with twilio: " + err);
      res.status(500).json({ msg: "error with twilio" });

    });
};
