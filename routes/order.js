const express = require('express');
const Order = require('../models/Order');
const router = express.Router();


router.post('/orders', (req, res) => {
    Order.create({
        user_id: req.body.user_id,
    totalCost: req.body.totalCost,
    cupOption: req.body.cupOption,
    address: req.body.address,
    zipcode: req.body.zipcode
    }
    ).then(order => {
        console.log(order)
        return res.status(200).json({order: order});
    })
});
module.exports = router;