const express = require("express");
const router = express.Router();

const sendMail = require("../services/mail_services");
const log = require("../services/logger_service");

router.get("/test", async (req,res) => {
    try{
         //email test
         await sendMail({
            to: "ridhipanchal2909@gmail.com",
            subject: "Test email",
            text: "notification is working"
         });

         //log test
         log.info("Test API called");

         res.send("All services working");
    } 
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;