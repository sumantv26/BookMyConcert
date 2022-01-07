const express = require("express");
// const auth = require("../routers/auth");
// const users = require("../routers/users");
// const userRouter = require("../routes/userRouter");
const winston = require("winston");
const userRouter = require("../routers/userRouter");
const managers = require("../routers/managers");

const images = require("../routers/images");
const error = require("../middleware/error");
const logger = require("./logger");

const app = express();

require("../startup/db")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/login", auth);
// app.use("/signup", users);
app.use("/api", images);
app.use("/users", userRouter);
app.use("/users/managers", managers);

// app.use("/users/customers",customers)

// for all unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(error);

module.exports = app;
