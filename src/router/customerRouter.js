const express = require('express')
const router = express.Router();
const upload = require("../middleware/upload.js");
const customerController = require('../controller/customer_controller')

router.post("/getCustomer", customerController.getCustomerById);
router.post('/addCustomer', customerController.addCustomer);
router.patch('/updateCustomer', customerController.updateCustomerByEmailId);
router.delete('/deleteCustomer',customerController.deleteCustomerByEmailId);

router.post('/uploadDocument',
            upload.array('documents', 5), // maximum upload 5 files
            customerController.uploadDocs);

module.exports = router

