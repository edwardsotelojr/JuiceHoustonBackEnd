const mongoose = require("mongoose");
const { Schema } = mongoose;

const drinkSchema = mongoose.Schema(
  {
    deliveryDate: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    quantityOfIngredients: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

module.exports = Drink = mongoose.model("drinks", drinkSchema);
