const express = require('express')
const router = express.Router();
const customerController = require('../controller/customer_controller')

router.get("/getCustomer", customerController.getCustomer);



module.exports = router

