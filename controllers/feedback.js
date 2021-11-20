const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");
const { json } = require("body-parser");


const createFeedback = async (req, res) => {
    const { _id: userId } = req.user;
    const values = pick(req.body, ['text', 'to']);
    values.author = userId;
  
    if (values.to && !(await Feedback.exists({ _id: values.to }))) {
      throw new ErrorHandler(404, 'Tweet not found');
    }
  
    const feedback = await Feedback.create(values);
  
    res.status(201).json({ feedback });
  
    if (values.to) {
      const originalFeedback = await Feedback.findById(values.to);
      //await originalFeedback.updateRepliesCount();
    }
  };

exports.getAll = async (req, res) => {
  const feedback = await Feedback.find((data) => data);

  try {
    console.log(feedback);
    // Data rendered as an object and passed down into index.ejs
    // res.status(200).render('index', { anime: anime });

    // Data returned as json so a fetch/axios requst can get it
    res.json(feedback);
  } catch (error) {
    console.log(error);
  }
};

exports.postFeedback = async (req, res) => {
  const feedback = new Feedback({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });

  feedback.save(function (err, result) {
    if (err) {
      console.log(err);
      return res.status(200).json({ err });
    } else {
      console.log("result: ", result);
      return res.status(500).json({ result });
    }
  });
};
