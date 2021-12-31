const express = require("express");

const app = require("./startup/app");
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
require("./startup/config")();
require("./startup/db")();
// require("./startup/app")();

const PORT=process.env.PORT||5000

app.listen(PORT, () => console.log("Listening to port "+PORT));
