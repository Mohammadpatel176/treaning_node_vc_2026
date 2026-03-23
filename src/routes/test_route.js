const express = require("express");
const router = require.Router();

const sendMail = require("../services/mail_services");

router.get("/test", async (req,res) => {
    try{
         //email test

    } 
    catch(err){
        res.status(500).send(err.message);
    }
})