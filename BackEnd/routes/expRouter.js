const express = require("express");
const Report = require("../models/ConcertModels/Report");

const router = express.Router();

router.patch("/:id", async (req, res, next) => {
  const report = await Report.findById(req.params.id);
});

module.exports = router;
