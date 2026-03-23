const Account = require("../models/TempAccount");
const Transaction = require("../models/Transaction");

// Validation helper
const validateAmount = (amount) => {
    if (!amount || typeof amount !== "number" || amount <= 0) {
        throw new Error("Amount must be a positive number");
    }
};

// ✅ Deposit
exports.deposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        validateAmount(amount);

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        account.balance += amount;
        await account.save();

        await Transaction.create({
            toAccount: id,
            type: "deposit",
            amount
        });

        res.json({ msg: "Deposit successful", balance: account.balance });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Withdraw
exports.withdraw = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        validateAmount(amount);

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        if (account.balance < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        account.balance -= amount;
        await account.save();

        await Transaction.create({
            fromAccount: id,
            type: "withdraw",
            amount
        });

        res.json({ msg: "Withdraw successful", balance: account.balance });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Transfer
exports.transfer = async (req, res) => {
    try {
        const { fromId, toId, amount } = req.body;

        if (!fromId || !toId) {
            return res.status(400).json({ msg: "Both fromId and toId are required" });
        }

        if (fromId === toId) {
            return res.status(400).json({ msg: "Cannot transfer to same account" });
        }

        validateAmount(amount);

        const fromAccount = await Account.findById(fromId);
        const toAccount = await Account.findById(toId);

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ msg: "One or both accounts not found" });
        }

        if (fromAccount.balance < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save();
        await toAccount.save();

        await Transaction.create({
            fromAccount: fromId,
            toAccount: toId,
            type: "transfer",
            amount
        });

        res.json({
            msg: "Transfer successful",
            fromBalance: fromAccount.balance,
            toBalance: toAccount.balance
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Transaction History
exports.getTransactionHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        const transactions = await Transaction.find({
            $or: [{ fromAccount: id }, { toAccount: id }]
        })
            .sort({ date: -1 });

        res.json({
            accountId: id,
            currentBalance: account.balance,
            transactions
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};