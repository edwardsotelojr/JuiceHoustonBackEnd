const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
         type: String,
         required: true
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true,
    },
    phone: {
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
    instructions: {
        type: String,
        required: false
    },
    verificationCode: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        required: false,
        default: false
    },
    verificationAttempt: {
        type: Number,
        default: 0
    },
    termsOfAgreement: {
        type: Boolean,
        required: true
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    drink: { type: mongoose.Schema.Types.ObjectId, ref: 'Drink'}
},   {
    timestamps: true,
    collection: 'users'
});

module.exports = User = mongoose.model('User', userSchema);