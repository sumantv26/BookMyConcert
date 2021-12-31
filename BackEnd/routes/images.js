const express = require('express');
const authUsers = require('../middleware/authUsers');
const router=express.Router()

router.use(authUsers)
router.use("/images",express.static(__dirname+"/../images/"))

module.exports=router