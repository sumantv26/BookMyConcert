const express = require("express");

const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.use(authController.restrictTo("admin"));

router.get("/nonApprovedMgr", adminController.requestedApproval);
router.patch("/nonApprovedMgr/:id", adminController.approveManager);
router.get("/reportedManagers", adminController.getReportedManagers);
router.patch("/reportedManagers/:id", adminController.banManager);
router.get("/bannedManagers", adminController.getBannedManagers);
router.patch("/bannedManagers/:id", adminController.unBanManager);
router.get("/withdrawal-requests", adminController.getWithdrawalRequests);
router.post("/withdrawal-accepted");
module.exports = router;
