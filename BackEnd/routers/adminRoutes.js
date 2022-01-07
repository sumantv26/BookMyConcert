const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
  next();
});

module.exports = router;
