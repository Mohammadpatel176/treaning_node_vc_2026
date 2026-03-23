const express = require("express");
const router = express.Router();

const controller = require("../controllers/transactionController");

router.post("/:id/deposit", controller.deposit);
router.post("/:id/withdraw", controller.withdraw);
router.post("/transfer", controller.transfer);
router.get("/:id/transactions", controller.getTransactionHistory);

module.exports = router;