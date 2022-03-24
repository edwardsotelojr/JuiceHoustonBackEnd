const mongoose = require("mongoose");
const { Schema } = mongoose;

const drinkSchema = mongoose.Schema(
  {
    deliveryDate: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true
    },
    ingredients: {
      type: Object,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    nutritionalFacts: {
      type: Object,
      required: false,
    },
    delivered: {
      type: Boolean
  },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
    collection: "drinks",
  }
);

module.exports = Drink = mongoose.model("Drink", drinkSchema);
