const express = require("express");
const {
  approveManger,
  getApprovedOrNonMangers,
} = require("../controllers/managersController");
const { authAdmin, authenticateUsers } = require("../middleware/authUsers");
const router = express.Router();
router.use(authenticateUsers);
router.use(authAdmin);
router.post("/approve/:id", approveManger);
router.get("/approved", getApprovedOrNonMangers);

module.exports = router;
