const express = require('express');
const customerModel = require('../module/customerModule');


const getCustomerById = async function (req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Enter an email!" });
        }

        const customer = await customerModel.findOne({ email: email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found with this email" });
        }

        return res.status(200).json(customer);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const addCustomer = async function (req, res) {

    try {

        const { name, email, password, phoneNo, street, state, country, dob } = req.body;

        const isExistCustomer = await customerModel.findOne({ email: email, password: password, phoneNo: phoneNo });
        if (isExistCustomer) {
            return res.status(200).json({ message: "customer is already exist" });
        }

        const customer = await customerModel.create({
            name: name,
            email: email,
            password: password,
            phoneNo: phoneNo,
            street: street,
            state: state,
            country: country,
            dob: dob
        });

        return res.status(200).json({ message: "customer created successfully", customer })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }

}


const updateCustomerByEmailId = async function (req, res) {

    try {

        const { email } = req.body;
        const updateCustomer = req.body;

        if (!email) {
            return res.status(400).json({ message: "Enter an email!" });
        }

        const customer = await customerModel.findOneAndUpdate(
            { email: email },
            updateCustomer,
            { new: true, runValidators: true })
        if (!customer) {
            return res.status(404).json({ message: "customer not found" })
        }
        return res.status(200).json({ message: "customer updated successfully", customer })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: `error while update Data ${error}` })
    }

}


const deleteCustomerByEmailId = async function (req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Enter an email!" });
        }

        const customer = await customerModel.findOneAndDelete({ email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found with this email" });
        }

        return res.status(200).json({
            message: "Customer deleted successfully"
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
}

const uploadDocs = async function (req, res) {
    try {
        const { emailId } = req.body;

        console.log(emailId);

        const filePath = req.files.map(file => `uploads/${file.filename}`);
        console.log(filePath);

        const customer = await customerModel.findOneAndUpdate(
            { email:  emailId.trim().toLowerCase() },
            { $push: { documents: { $each: filePath } } },
            { returnDocument: 'after' }
        );

        console.log("customer Data: ",customer);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Files uploaded successfully",
            data: customer
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getCustomerById,
    addCustomer,
    updateCustomerByEmailId,
    deleteCustomerByEmailId,
    uploadDocs

}