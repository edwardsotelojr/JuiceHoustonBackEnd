const { Router } = require('express');
const router = Router();
const { login, signup, verify, loginAfterVerified, edit } = require('../controllers/user.js');
const { placeOrder, getUserOrders, paymentIntent } = require('../controllers/order.js');
const { getDrink } = require('../controllers/drink.js')
router.post('/login', login);
router.post('/signup', signup);
router.patch('/verify', verify);
router.post('/loginAfterVerified', loginAfterVerified)
router.patch('/edit/:_id', edit);
router.post('/placeOrder', placeOrder);
router.get('/orders/', getUserOrders);
router.post("/create-payment-intent", paymentIntent);
router.get('/drink/', getDrink);
module.exports = router;