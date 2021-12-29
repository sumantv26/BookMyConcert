const express = require("express");
const auth = require("../routers/auth");
module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/auth", auth);
};
