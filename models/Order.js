const mongoose = require('mongoose');
const { Schema }= mongoose;

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    totalCost: {
         type: Number,
         required: true
    },
    cupOption: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    gateCode: {
        type: String,
        required: false
    },
    suiteNumber: {
        type: String,
        required: false
    },
    instructions:{
        type: String,
        required: false
    },
    drinks: [{type: Schema.Types.ObjectId, ref: 'Drink'
}],
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
},   {
    timestamps: true,
    collection: 'orders'
});

module.exports = Order = mongoose.model('orders', orderSchema);