const { Router } = require('express');
const router = Router();
const { login, signup, edit } = require('../controllers/user.js');
const { placeOrder, getUserOrders } = require('../controllers/order.js');

router.post('/login', login);
router.post('/signup', signup);
router.patch('/edit/:_id', edit);

router.post('/placeOrder', placeOrder);
router.get('/orders/', getUserOrders);
module.exports = router;