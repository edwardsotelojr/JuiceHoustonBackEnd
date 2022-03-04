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
    sizeOfOrder: {
        type: Number,
        required: true
    },
    orderPlaced: {
        type: String,
    },
    lastDay: {
        type: String
    },
    instructions:{
        type: String,
        required: false
    },
    agreement:{
        type: Boolean,
        required: true
    },
    drinks: [{type: Schema.Types.ObjectId, ref: 'Drink'
}],
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
},   {
    collection: 'orders'
});

module.exports = Order = mongoose.model('orders', orderSchema);