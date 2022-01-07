const express = require("express");
const { authenticateUsers } = require("../middleware/authUsers");
const router = express.Router();

router.use(authenticateUsers);
router.use("/images", express.static(__dirname + "/../images/"));

module.exports = router;
